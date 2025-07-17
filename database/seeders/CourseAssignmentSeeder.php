<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Domain\Course\Models\Course;
use Domain\AcademicPeriod\Models\AcademicYear;
use Domain\AcademicPeriod\Models\Semester;
use Domain\User\Models\User;

class CourseAssignmentSeeder extends Seeder
{
    public function run(): void
    {
        $courses = Course::all();
        $academicYears = AcademicYear::all();
        $instructors = User::role('instructor')->get();
        $headOfDepartments = User::role('hod')->get();

        foreach ($courses as $course) {
            foreach ($academicYears as $academicYear) {
                $semesters = Semester::where('academic_year_id', $academicYear->id)->get();

                foreach ($semesters as $semester) {
                    $assignedInstructors = $instructors->random(rand(1, 3))->pluck('id')->toArray();
                    $headOfDepartment = $headOfDepartments->random();

                    DB::table('courses_academic_years_semesters_users')->insert([
                        'course_id' => $course->id,
                        'academic_year_id' => $academicYear->id,
                        'semester_id' => $semester->id,
                        'instructor_id' => implode(',', $assignedInstructors),
                        'head_of_dept_id' => $headOfDepartment->id,
                        'is_active' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
