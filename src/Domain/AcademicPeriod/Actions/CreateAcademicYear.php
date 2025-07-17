<?php

namespace Domain\AcademicPeriod\Actions;

use Domain\AcademicPeriod\DataTransferObjects\CreateAcademicYearData;
use Domain\AcademicPeriod\Models\AcademicYear;

class CreateAcademicYear
{
    public function execute(CreateAcademicYearData $createAcademicYearData)
    {
        $academicYear = AcademicYear::query()->firstOrCreate([
            'start_date' => $createAcademicYearData->startDate,
            'end_date' => $createAcademicYearData->endDate
        ]);

        $academicYear->refresh();

        return $academicYear;
    }
}
