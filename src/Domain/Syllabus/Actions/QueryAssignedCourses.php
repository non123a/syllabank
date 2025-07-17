<?php

namespace Domain\Syllabus\Actions;

use Domain\Course\Models\Course;
use Illuminate\Support\Facades\DB;

class QueryAssignedCourses
{
    public function execute($instructorId)
    {
        return Course::join('courses_academic_years_semesters_users', 'courses.id', '=', 'courses_academic_years_semesters_users.course_id')
            ->join('academic_years', 'courses_academic_years_semesters_users.academic_year_id', '=', 'academic_years.id')
            ->join('semesters', 'courses_academic_years_semesters_users.semester_id', '=', 'semesters.id')
            ->select(
                'courses_academic_years_semesters_users.id as id',
                'courses.id as course_id',
                'courses.course_subject',
                'courses.course_code',
                'courses.course_name',
                'courses.description',
                'academic_years.start_date as academic_year_start',
                'academic_years.end_date as academic_year_end',
                'semesters.semester_number',
                'courses_academic_years_semesters_users.is_active',
                'courses_academic_years_semesters_users.created_at'
            )
            ->whereRaw('CAST(courses_academic_years_semesters_users.instructor_id AS TEXT) LIKE ?', ["%$instructorId%"])
            ->where('courses_academic_years_semesters_users.is_active', true)
            ->orderBy('courses_academic_years_semesters_users.created_at', 'desc')
            ->get();
    }
}
