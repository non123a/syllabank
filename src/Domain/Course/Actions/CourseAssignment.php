<?php

namespace Domain\Course\Actions;

use Domain\Course\DataTransferObjects\CourseAssignmentData;
use Domain\Course\Models\Course;
use Domain\AcademicPeriod\Models\AcademicYear;
use Domain\AcademicPeriod\Models\Semester;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Auth;

class CourseAssignment
{
    public function execute(CourseAssignmentData $data): array
    {
        try {
            $result = DB::transaction(function () use ($data) {
                $course = Course::findOrFail($data->course_id);
                $academicYear = AcademicYear::findOrFail($data->academic_year_id);
                $semester = Semester::findOrFail($data->semester_id);
                $user = auth()->user();

                // Check if the assignment already exists for the same course, academic year, and semester
                $existingAssignment = DB::table('courses_academic_years_semesters_users')
                    ->where('course_id', $course->id)
                    ->where('academic_year_id', $academicYear->id)
                    ->where('semester_id', $semester->id)
                    ->first();

                if ($existingAssignment) {
                    return [
                        'success' => false,
                        'message' => 'This course is already assigned to the selected academic year and semester.'
                    ];
                }

                $inserted = DB::table('courses_academic_years_semesters_users')->insert([
                    'course_id' => $course->id,
                    'academic_year_id' => $academicYear->id,
                    'semester_id' => $semester->id,
                    'instructor_id' => null,
                    'head_of_dept_id' => $user->id,
                    'department' => $user->department->code_name,
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                return [
                    'success' => $inserted,
                    'message' => $inserted ? 'Course assigned successfully.' : 'Failed to assign course.'
                ];
            });

            return $result;
        } catch (QueryException $e) {
            if ($e->getCode() == 23000) {
                return [
                    'success' => false,
                    'message' => 'This course assignment already exists.'
                ];
            }

            return [
                'success' => false,
                'message' => 'An error occurred while assigning the course.'
            ];
        }
    }
}
