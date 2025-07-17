<?php

namespace Domain\AcademicPeriod\Actions;

use Domain\AcademicPeriod\DataTransferObjects\CreateSemesterForAcademicYearData;
use Domain\AcademicPeriod\Models\AcademicYear;

class CreateSemesterForAcademicYear
{
    public function execute(CreateSemesterForAcademicYearData $createSemesterForAcademicYearData)
    {
        $academicYear = AcademicYear::query()->findOrFail($createSemesterForAcademicYearData->academicYearId);

        if ($createSemesterForAcademicYearData->semesterStartDate->startOfDay()->utc()->lessThanOrEqualTo($academicYear->start_date)) {
            throw new \App\Exceptions\SemesterStartDateShouldBeGreaterThanAcademicYearStartDate();
        }

        if ($createSemesterForAcademicYearData->semesterEndDate->startOfDay()->utc()->greaterThanOrEqualTo($academicYear->end_date)) {
            throw new \App\Exceptions\SemesterEndDateShouldBeLesserThanAcademicYearEndDate();
        }

        $academicYear->semesters()->create([
            'semester_number' => $createSemesterForAcademicYearData->semester,
            'start_date' => $createSemesterForAcademicYearData->semesterStartDate->startOfDay()->utc(),
            'end_date' => $createSemesterForAcademicYearData->semesterEndDate->startOfDay()->utc(),
        ]);

        return $academicYear->refresh();
    }
}
