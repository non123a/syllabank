<?php

namespace Domain\AcademicPeriod\DataTransferObjects;

use Carbon\Carbon;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Casts\DateTimeInterfaceCast;
use Spatie\LaravelData\Data;

class CreateSemesterForAcademicYearData extends Data
{
    #[WithCast(DateTimeInterfaceCast::class)]
    public Carbon $startDate;

    #[WithCast(DateTimeInterfaceCast::class)]
    public Carbon $endDate;

    public function __construct(
        public int $semester,
        #[MapInputName('startDate')]
        public Carbon $semesterStartDate,
        #[MapInputName('endDate')]
        public Carbon $semesterEndDate,
        public int $academicYearId,
    ) {
    }

    public static function rules($context): array
    {
        return [
            'semester' => ['required', 'in:1,2'],
            'startDate' => ['required', 'date', 'before:endDate'],
            'endDate' => ['required', 'date', 'after:startDate'],
            'academicYearId' => ['required'],
        ];
    }
}
