<?php

namespace Domain\Course\Actions;

use Domain\Course\Models\Course;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class QueryCourses
{
    public function execute()
    {
        return QueryBuilder::for(Course::class)
            ->allowedFilters([
                AllowedFilter::exact('is_active'),
                AllowedFilter::exact('author_id'),
                AllowedFilter::callback('subject,name,code', function (Builder $query, $value) {
                    $query->where(function (Builder $query) use ($value) {
                        $query->where('course_subject', 'ilike', "%{$value}%")
                            ->orWhere('course_name', 'ilike', "%{$value}%")
                            ->orWhere('course_code', 'like', "%{$value}%")
                            ->orWhereHas('author', function (Builder $query) use ($value) {
                                $query->where('name', 'ilike', "%{$value}%");
                            });
                    });
                }),
            ])
            ->allowedSorts(['course_subject', 'course_name', 'course_code', 'created_at'])
            ->allowedIncludes(['semester', 'academicYear', 'sections', 'author'])
            ->defaultSort('course_subject', 'course_code')
            ->with('author:id,name,department_id')
            ->jsonPaginate();
    }
}