<?php

namespace Domain\Syllabus\Actions;

use Domain\AcademicPeriod\Models\AcademicYear;
use Domain\Syllabus\Models\Syllabus;
use Domain\Course\Models\Course;
use Domain\Course\Actions\QueryCourseAssignments;
use Domain\Syllabus\DataTransferObjects\CreateASyllabusData;
use Domain\Syllabus\Models\SyllabusTemplate;
use Domain\Syllabus\States\SyllabusState;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

class CreateASyllabus
{
    public function __construct(private QueryCourseAssignments $queryCourseAssignments) {}

    public function execute(CreateASyllabusData $createASyllabusData): array
    {
        $courseAssignment = $this->queryCourseAssignments->execute()
            ->where('assignment_id', $createASyllabusData->assignmentId)
            ->first();

        if (!$courseAssignment) {
            throw new \Exception('Course assignment not found');
        }

        $course = Course::findOrFail($courseAssignment->course_id);

        $academicYearStart = $courseAssignment->academic_year_start;
        $academicYearEnd = $courseAssignment->academic_year_end;
        $semester = $courseAssignment->semester_number;

        $existingSyllabus = $this->checkExistingSyllabus($course, $academicYearStart, $academicYearEnd, $semester);

        if ($existingSyllabus) {
            $author = $existingSyllabus->author;
            throw new \Exception("A syllabus for this course, academic year, and semester already exists. It was created by {$author->name}. You can modify or use the existing syllabus instead.");
        }

        $syllabusName = $this->generateSyllabusName($course);

        $syllabusData = [
            'syllabus_name' => $syllabusName,
            'course_id' => $courseAssignment->course_id,
            'academic_year_start' => $academicYearStart,
            'academic_year_end' => $academicYearEnd,
            'semester_number' => $semester,
            'sections' => $createASyllabusData->sections,
            'author_id' => $createASyllabusData->author_id,
            'last_modified_by' => $createASyllabusData->author_name,
            'course_assignment_id' => $createASyllabusData->assignmentId,
            'status' => SyllabusState::DRAFT,
            'receiver_id' => null,
            'is_file_upload' => $createASyllabusData->isFileUpload,
            'credit' => $createASyllabusData->credits,
            'status_timeline' => json_encode([
                [
                    'status' => SyllabusState::DRAFT,
                    'date' => now()->toIso8601String(),
                    'comments' => [
                        [
                            'from' => [
                                'name' => $createASyllabusData->author_name ?? 'System',
                                'id' => $createASyllabusData->author_id
                            ],
                            'content' => 'Initial syllabus created',
                            'created_at' => now()->toIso8601String(),
                        ]
                    ]
                ]
            ])
        ];

        Log::info($syllabusData);

        if (!$createASyllabusData->isFileUpload) {
            if (!empty($createASyllabusData->templateId)) {
                $template = SyllabusTemplate::findOrFail($createASyllabusData->templateId);
                $syllabusData['content'] = $template->content;
                if (empty($syllabusData['content'])) {
                    throw new \Exception('Template content is empty');
                }
            }
            $syllabusData['pdf_base64'] = null;
        } else {
            $syllabusData['content'] = null;
            if ($createASyllabusData->pdfFile) {
                $pdfContent = $this->getPdfContent($createASyllabusData->pdfFile);
                if ($pdfContent) {
                    $syllabusData['pdf_base64'] = base64_encode($pdfContent);
                } else {
                    $syllabusData['pdf_base64'] = null;
                }
            } else {
                $syllabusData['pdf_base64'] = null;
            }
        }

        $createdSyllabus = Syllabus::create($syllabusData);

        $createdSyllabus->author_id = $createASyllabusData->author_id;

        $createdSyllabus->save();

        return [
            'status' => 'success',
            'syllabus' => $createdSyllabus,
        ];
    }

    private function generateSyllabusName(Course $course): string
    {
        $baseNameFormat = '%s%s - %s';
        $baseName = sprintf(
            $baseNameFormat,

            $course->course_subject,
            $course->course_code,
            $course->course_name
        );


        return $baseName;
    }

    private function getPdfContent($pdfFile)
    {
        if ($pdfFile instanceof \Illuminate\Http\UploadedFile) {
            return file_get_contents($pdfFile->path());
        } elseif (is_string($pdfFile) && file_exists($pdfFile)) {
            return file_get_contents($pdfFile);
        }
        return null;
    }

    private function checkExistingSyllabus(Course $course, string $academicYearStart, string $academicYearEnd, int $semester): ?Syllabus
    {
        return Syllabus::where('course_id', $course->id)
            ->where('academic_year_start', $academicYearStart)
            ->where('academic_year_end', $academicYearEnd)
            ->where('semester_number', $semester)
            ->first();
    }
}
