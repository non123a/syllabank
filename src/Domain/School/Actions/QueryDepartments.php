<?php

namespace Domain\School\Actions;

use Domain\School\Models\Department;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class QueryDepartments
{
    public function execute()
    {
        return QueryBuilder::for(Department::class)
            ->allowedFilters([
                AllowedFilter::exact('is_active'),
                AllowedFilter::partial('code_name'),
                AllowedFilter::partial('full_name'),
                AllowedFilter::exact('faculty_id'),
                AllowedFilter::callback('search', function (Builder $query, $value) {
                    $query->where(function (Builder $q) use ($value) {
                        $q->where('code_name', 'like', "%{$value}%")
                            ->orWhere('full_name', 'like', "%{$value}%")
                            ->orWhereHas('faculty', function (Builder $fq) use ($value) {
                                $fq->where('code_name', 'like', "%{$value}%");
                            });
                    });
                }),
            ])
            ->allowedIncludes(['faculty', 'courses', 'users'])
            ->allowedSorts(['code_name', 'full_name', 'faculty_id'])
            ->with('faculty')
            ->jsonPaginate();
    }
}
