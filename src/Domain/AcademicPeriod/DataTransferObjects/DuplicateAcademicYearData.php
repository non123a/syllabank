<?php

namespace Domain\AcademicPeriod\DataTransferObjects;

use Carbon\Carbon;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Casts\DateTimeInterfaceCast;
use Spatie\LaravelData\Data;

class DuplicateAcademicYearData extends Data
{
    #[WithCast(DateTimeInterfaceCast::class)]
    public Carbon $academicYearStartDate;

    #[WithCast(DateTimeInterfaceCast::class)]
    public Carbon $academicYearEndDate;
    public function __construct(
        public int $sourceAcademicYearId,
        $academicYearStartDate,
        $academicYearEndDate
    ) {
        $this->academicYearStartDate = $academicYearStartDate;
        $this->academicYearEndDate = $academicYearEndDate;
    }

    public static function rules($context): array
    {
        return [
            'sourceAcademicYearId' => ['required', 'integer'],
            'academicYearStartDate' => ['required', 'date'],
            'academicYearEndDate' => ['required', 'date', 'after:academicYearStartDate'],
        ];
    }
}
