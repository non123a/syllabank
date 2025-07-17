<?php

namespace Domain\AcademicPeriod\Actions;

use Domain\AcademicPeriod\DataTransferObjects\DuplicateAcademicYearData;
use Domain\AcademicPeriod\Models\AcademicYear;
use Domain\AcademicPeriod\Models\Semester;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DuplicateAcademicYear
{
    public function execute(DuplicateAcademicYearData $duplicateAcademicYearData)
    {
        DB::transaction(function () use ($duplicateAcademicYearData) {
            /**
             * @var AcademicYear $sourceAcademicYear
             */
            $sourceAcademicYear = AcademicYear::with(['semesters'])->find($duplicateAcademicYearData->sourceAcademicYearId);

            $duplicatedAcademicYear = $sourceAcademicYear->replicate();

            $startDateUtc = $duplicateAcademicYearData
                ->academicYearStartDate
                ->startOfYear();

            $endDateUtc = $duplicateAcademicYearData
                ->academicYearEndDate
                ->startOfYear();

            $duplicatedAcademicYear->fill([
                "start_date" => $startDateUtc->toISOString(),
                "end_date" => $endDateUtc->toISOString(),
            ]);

            $duplicatedAcademicYear->save();

            $sourceAcademicYear
                ->semesters
                ->each(function (Semester $semester) use ($duplicatedAcademicYear, $duplicateAcademicYearData) {

                    $duplicatedSemester = $semester->replicate();

                    $duplicatedSemester->academicYear()->associate($duplicatedAcademicYear);

                    $startDateSemester = Carbon::parse($semester->start_date)
                        ->setYear($duplicateAcademicYearData->academicYearStartDate->year)
                        ->toISOString();

                    $endDateSemester = Carbon::parse($semester->end_date)
                        ->setYear($duplicateAcademicYearData->academicYearStartDate->year)
                        ->toISOString();

                    $duplicatedSemester->fill([
                        "start_date" => $startDateSemester,
                        "end_date" => $endDateSemester,
                    ]);

                    $duplicatedSemester->save();
                });
        });
    }
}
