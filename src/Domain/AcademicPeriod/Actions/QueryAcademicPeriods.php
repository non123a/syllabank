<?php

namespace Domain\AcademicPeriod\Actions;

use Domain\AcademicPeriod\Models\AcademicYear;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedInclude;
use Spatie\QueryBuilder\QueryBuilder;

class QueryAcademicPeriods
{
    public function execute()
    {
        return QueryBuilder::for(AcademicYear::class)
            ->allowedFilters([
                'start_date',
                'end_date',
                AllowedFilter::callback(
                    'not-by-id',
                    fn(Builder $query, $search) => $query->whereKeyNot($search)
                ),
            ])
            ->allowedIncludes([
                AllowedInclude::callback('semesters', function ($query) {
                    $query->when(request()->exists('include-filter.semester-not-by-id'), function ($query) {
                        $query->whereKeyNot(request()->input('include-filter.semester-not-by-id'));
                    });
                }),
            ])
            ->defaultSort('-start_date')
            ->jsonPaginate();
    }
}