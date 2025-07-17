<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Domain\Syllabus\Models\Syllabus;
use Domain\Course\Models\Course;
use Domain\AcademicPeriod\Models\AcademicYear;
use Domain\AcademicPeriod\Models\Semester;
use Domain\User\Models\User;
use Illuminate\Support\Facades\DB;

class SyllabusSeeder extends Seeder
{
    public function run()
    {
        $courseAssignments = DB::table('courses_academic_years_semesters_users')->get();

        foreach ($courseAssignments as $assignment) {
            $course = Course::find($assignment->course_id);
            $academicYear = AcademicYear::find($assignment->academic_year_id);
            $semester = Semester::find($assignment->semester_id);
            $instructorIds = explode(',', $assignment->instructor_id);
            $instructor = User::find($instructorIds[0]); // Using the first instructor for simplicity

            $syllabus = new Syllabus([
                'syllabus_name' => "{$course->course_subject}{$course->course_code} - {$course->course_name}",
                'status' => 'approved',
                'content' => $this->generateSyllabusContent($course, $academicYear, $semester),
                'sections' => json_encode(['1', '2', '3', '4']),
                'is_active' => true,
                'is_file_upload' => false,
                'last_modified_by' => $instructor->name,
                'course_assignment_id' => $assignment->id,
                'course_id' => $course->id,
                'author_id' => $instructor->id,
                'semester_number' => $semester->semester_number,
                'academic_year_start' => $academicYear->start_date,
                'academic_year_end' => $academicYear->end_date,
                'credit' => $course->credit ?? rand(1, 4),
                'status_timeline' => json_encode([
                    [
                        'status' => 'draft',
                        'date' => now()->toIso8601String(),
                        'comments' => [
                            [
                                'from' => [
                                    'name' => $instructor->name,
                                    'id' => $instructor->id
                                ],
                                'content' => 'Initial syllabus created',
                                'created_at' => now()->toIso8601String(),
                            ]
                        ]
                    ]
                ])
            ]);

            $syllabus->save();
        }
    }

    private function generateSyllabusContent($course, $academicYear, $semester)
    {
        $content = [
            'head' => [
                'title' => "{$course->course_subject}{$course->course_code} Syllabus",
                'styles' => '/* Styles will be populated by getStyles() method */',
            ],
            'body' => [
                'header' => [
                    'logo' => [
                        'src' => '/images/logo.png',
                        'alt' => 'Paragon International University Logo',
                    ],
                    'courseInfo' => [
                        'courseCode' => "{$course->course_subject}{$course->course_code}",
                        'academicYear' => "{$academicYear->start_date->format('Y')}/{$academicYear->end_date->format('Y')}",
                        'semester' => "Semester {$semester->semester_number}",
                        'credits' => "Credits: " . ($course->credit ?? 'TBD'),
                    ],
                ],
                'content' => [
                    'instructorInfo' => [
                        'title' => 'Instructor Information',
                        'data' => [
                            ['label' => 'Name', 'value' => '[Include your title and what you prefer to be called]'],
                            ['label' => 'Contact Info', 'value' => '[Include information for your preferred method of contact here and office #]'],
                            ['label' => 'Office hours', 'value' => '[Write by appointment if you don\'t have scheduled office hours]'],
                        ],
                    ],
                    'courseDescription' => [
                        'title' => 'Course Description',
                        'description' => $course->description,
                    ],
                    'courseObjectives' => [
                        'title' => 'Course Objectives',
                        'description' => 'Course objectives will be defined by the instructor.',
                    ],
                    'learningOutcomes' => [
                        'title' => 'Learning Outcomes',
                        'description' => 'Learning outcomes will be defined by the instructor.',
                    ],
                    'assessment' => [
                        'title' => 'Assessment',
                        'description' => 'Assessment details will be provided by the instructor.',
                        'table' => [
                            'headers' => ['Assessment', 'Percentage of Final Grade'],
                            'rows' => [
                                ['Attendance', '10%'],
                                ['[Assessment 1]', '[Percentage 1]'],
                                ['[Assessment 2]', '[Percentage 2]'],
                            ],
                        ],
                    ],
                    'courseSchedule' => [
                        'title' => 'Course Schedule',
                        'table' => [
                            'headers' => ['Week', 'Topic', 'Activities'],
                            'rows' => [
                                ['Week 11', '[Topic 1]', '[Activities 1]'],
                                ['Week 2', '[Topic 2]', '[Activities 2]'],
                                // Add more weeks as needed
                            ],
                        ],
                    ],
                ],
                'footer' => [
                    'content' => 'Paragon International University',
                ],
            ],
        ];

        return json_encode($content);
    }
}
