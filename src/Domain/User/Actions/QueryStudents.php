<?php

namespace Domain\User\Actions;

use Domain\User\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class QueryStudents
{
    public function execute()
    {
        return QueryBuilder::for(User::class)
            ->with('roles')
            ->allowedFilters([
                AllowedFilter::callback('name,email,identification', function (Builder $query, string $value) {
                    $query->where(function (Builder $q) use ($value) {
                        $q->where('name', 'like', "%{$value}%")
                            ->orWhere('email', 'like', "%{$value}%")
                            ->orWhere('identification_number', 'like', "%{$value}%");
                    });
                }),
                AllowedFilter::callback('english_level', function (Builder $query, string $value) {
                    $query->where('metadata->english_level', $value);
                }),
                AllowedFilter::callback('academic_period', function (Builder $query, $value) {
                    $academicYearSemester = explode('|', $value);

                    $academicSemester = $academicYearSemester[1];

                    $query
                        ->whereHas('semesters', function (Builder $q) use ($academicSemester) {
                            $q->where('semesters.id', $academicSemester);
                        });
                }),
                AllowedFilter::callback('section', function (Builder $query, $value) {
                    $query
                        ->whereHas('sections', function (Builder $q) use ($value) {
                            $q->where('class_section_id', $value);
                        });
                }),
                AllowedFilter::callback('not-in-section-id', function (Builder $query, $value) {
                    $query
                        ->whereDoesntHave('sections', function (Builder $q) use ($value) {
                            $q->where('class_section_id', $value);
                        });
                }),
            ])
            ->role('student')
            ->jsonPaginate();
    }
}
