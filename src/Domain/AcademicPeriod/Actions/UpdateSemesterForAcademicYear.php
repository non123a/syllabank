<?php

namespace Domain\AcademicPeriod\Actions;

use Domain\AcademicPeriod\DataTransferObjects\UpdateSemesterForAcademicYearData;
use Domain\AcademicPeriod\Models\AcademicYear;

class UpdateSemesterForAcademicYear
{
    public function execute(UpdateSemesterForAcademicYearData $updateSemesterForAcademicYearData)
    {
        $academicYear = AcademicYear::query()->findOrFail($updateSemesterForAcademicYearData->academicYearId);

        $semester = $academicYear->semesters()->findOrFail($updateSemesterForAcademicYearData->semesterId);

        if ($updateSemesterForAcademicYearData->startDate->clone()->startOfDay()->utc()->lessThanOrEqualTo($academicYear->start_date)) {
            throw new \App\Exceptions\SemesterStartDateShouldBeGreaterThanAcademicYearStartDate();
        }

        if ($updateSemesterForAcademicYearData->endDate->clone()->startOfDay()->utc()->greaterThanOrEqualTo($academicYear->end_date)) {
            throw new \App\Exceptions\SemesterEndDateShouldBeLesserThanAcademicYearEndDate();
        }

        $semester->update([
            'semester_number' => $updateSemesterForAcademicYearData->semester,
            'start_date' => $updateSemesterForAcademicYearData->startDate->startOfDay()->toISOString(),
            'end_date' => $updateSemesterForAcademicYearData->endDate->startOfDay()->toISOString(),
        ]);

        return $academicYear->refresh();
    }
}
