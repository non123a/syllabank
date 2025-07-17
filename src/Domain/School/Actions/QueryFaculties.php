<?php

namespace Domain\School\Actions;

use Domain\School\Models\Faculty;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class QueryFaculties
{
    public function execute()
    {
        return QueryBuilder::for(Faculty::class)
            ->allowedFilters([
                AllowedFilter::exact('is_active'),
                AllowedFilter::partial('code_name'),
                AllowedFilter::partial('full_name'),
                AllowedFilter::callback('search', function (Builder $query, $value) {
                    $query->where(function (Builder $q) use ($value) {
                        $q->where('code_name', 'like', "%{$value}%")
                            ->orWhere('full_name', 'like', "%{$value}%");
                    });
                }),
            ])
            ->allowedIncludes(['departments', 'dean'])
            ->allowedSorts(['code_name', 'full_name'])
            ->jsonPaginate();
    }
}
