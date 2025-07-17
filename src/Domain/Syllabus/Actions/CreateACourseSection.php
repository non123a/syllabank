<?php

namespace Domain\Syllabus\Actions;

use Domain\Course\DataTransferObjects\CreateACourseSectionData;
use Domain\Course\DataTransferObjects\CreateASyllabusData;
use Domain\Syllabus\Models\Course;
use Illuminate\Support\Facades\DB;

class CreateACourseSection
{
    public function __construct(protected CreateASyllabus $createASyllabus)
    {
    }

    public function execute(CreateACourseSectionData $createACourseSectionData)
    {
        try {
            DB::beginTransaction();
            // Find the course of which section is to be created and associated with
            $course = Course::findOrFail($createACourseSectionData->courseId);

            $courseSection = $course->sections()->make([
                'section_name' => $createACourseSectionData->sectionName,
            ]);

            // Assign the author to the section
            $courseSection->author()->associate($createACourseSectionData->authorId)->save();

            // 2023-2024CS101
            // 2023-2024CS101-1
            $syllabusName = $course->academicYear()->start_and_end . $course->name . $course->code;

            $syllabus = $this->createASyllabus->execute(CreateASyllabusData::from([
                'syllabusName' => $syllabusName,
                'content' => '',
            ]));

            // Associate the syllabus with the course
            // Thereby, the syllabus is associated with the section through the course
            $syllabus->course()->associate($course)->save();

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
