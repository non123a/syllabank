<?php

namespace Domain\AcademicPeriod\Actions;

use Domain\AcademicPeriod\DataTransferObjects\CreateAcademicYearWithSemestersData;
use Domain\AcademicPeriod\Models\AcademicYear;

class CreateAcademicYearWithSemesters
{
    public function execute(CreateAcademicYearWithSemestersData $createAcademicYearWithSemestersData)
    {
        // Create an academic year
        /**
         * @var AcademicYear $academicYear
         */
        $academicYear = AcademicYear::query()->firstOrCreate([
            'start_date' => $createAcademicYearWithSemestersData->academicYear->startDate,
            'end_date' => $createAcademicYearWithSemestersData->academicYear->endDate
        ]);

        foreach ($createAcademicYearWithSemestersData->semesters as $semester) {
            $academicYear->semesters()->create([
                'semester_number' => $semester->name,
                'start_date' => $semester->startDate,
                'end_date' => $semester->endDate
            ]);
        }

        $academicYear->refresh();

        return $academicYear;
    }
}
