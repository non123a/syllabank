<?php

namespace Domain\Syllabus\Actions;

use Domain\Syllabus\Models\SyllabusTemplate;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class QueryFilteredSyllabusTemplate
{
    public function execute()
    {
        return QueryBuilder::for(SyllabusTemplate::class)
            ->allowedFilters([
                AllowedFilter::exact('is_active'),
            ])
            ->when(request()->has('is_active'), function ($query) {
                return $query->where('is_active', request()->boolean('is_active'));
            })
            ->allowedSorts(['created_at'])
            ->defaultSort('created_at')
            ->get();
    }
}
