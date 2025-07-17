<?php

namespace Domain\Course\Actions;

use Domain\Course\Models\Course;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class QueryCourseAssignments
{
    public function execute()
    {
        return QueryBuilder::for(Course::class)
            ->join('courses_academic_years_semesters_users', 'courses.id', '=', 'courses_academic_years_semesters_users.course_id')
            ->join('academic_years', 'courses_academic_years_semesters_users.academic_year_id', '=', 'academic_years.id')
            ->join('semesters', 'courses_academic_years_semesters_users.semester_id', '=', 'semesters.id')
            ->leftJoin('users as instructors', function ($join) {
                $join->on('courses_academic_years_semesters_users.instructor_id', '=', DB::raw('instructors.id::varchar'));
            })
            ->leftJoin('users as head_of_dept', 'courses_academic_years_semesters_users.head_of_dept_id', '=', 'head_of_dept.id')
            ->select(
                'courses_academic_years_semesters_users.id as assignment_id',
                'courses.id as course_id',
                'courses.course_subject',
                'courses.course_code',
                'courses.course_name',
                'academic_years.id as academic_year_id',
                'semesters.id as semester_id',
                'academic_years.start_date as academic_year_start',
                'academic_years.end_date as academic_year_end',
                'semesters.semester_number',
                'courses_academic_years_semesters_users.instructor_id',
                'courses_academic_years_semesters_users.head_of_dept_id',
                'courses_academic_years_semesters_users.is_active',
                'courses_academic_years_semesters_users.department as department'
            )
            ->selectRaw('CASE WHEN head_of_dept.id IS NULL THEN \'N/A\' ELSE head_of_dept.name END as head_of_dept_name')
            ->selectRaw("
                CASE
                    WHEN courses_academic_years_semesters_users.instructor_id IS NOT NULL
                    THEN (
                        SELECT string_agg(name, ', ')
                        FROM users
                        WHERE id::varchar = ANY(string_to_array(courses_academic_years_semesters_users.instructor_id, ','))
                    )
                    ELSE 'N/A'
                END as instructor_names
            ")
            ->allowedFilters([
                AllowedFilter::exact('courses_academic_years_semesters_users.academic_year_id'),
                AllowedFilter::exact('courses_academic_years_semesters_users.semester_id'),
                AllowedFilter::exact('courses_academic_years_semesters_users.is_active'),
                AllowedFilter::callback('search', function (Builder $query, $value) {
                    $query->where(function (Builder $query) use ($value) {
                        $query->where('courses.course_subject', 'ilike', "%{$value}%")
                            ->orWhere('courses.course_name', 'ilike', "%{$value}%")
                            ->orWhere('courses.course_code', 'ilike', "%{$value}%")
                            ->orWhereRaw("
                                EXISTS (
                                    SELECT 1
                                    FROM users
                                    WHERE users.id::varchar = ANY(string_to_array(courses_academic_years_semesters_users.instructor_id, ','))
                                    AND users.name ILIKE ?
                                )", ["%{$value}%"]);
                    });
                }),
            ])
            ->groupBy(
                'courses_academic_years_semesters_users.id',
                'courses.id',
                'academic_years.id',
                'semesters.id',
                'instructors.id',
                'head_of_dept.id',
                'courses_academic_years_semesters_users.instructor_id',
                'courses_academic_years_semesters_users.head_of_dept_id',
                'courses_academic_years_semesters_users.is_active'
            )
            ->jsonPaginate();
    }
}
