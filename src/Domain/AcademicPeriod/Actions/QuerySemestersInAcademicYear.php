<?php

namespace Domain\AcademicPeriod\Actions;

use Domain\AcademicPeriod\DataTransferObjects\QuerySemestersInAcademicYearData;
use Domain\AcademicPeriod\Models\AcademicYear;

class QuerySemestersInAcademicYear
{
    public function execute($academicYearId)
    {
        $academicYear = AcademicYear::query()->findOrFail($academicYearId);

        return $academicYear->semesters()->orderBy('semester_number', 'asc')->get();
    }
}