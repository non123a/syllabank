<?php

namespace Domain\AcademicPeriod\Actions;

use Domain\AcademicPeriod\Models\AcademicYear;
use Spatie\QueryBuilder\QueryBuilder;

class QueryAcademicYears
{
    public function execute()
    {
        return QueryBuilder::for(AcademicYear::class)
            ->defaultSort('year')
            ->jsonPaginate();
    }
}
