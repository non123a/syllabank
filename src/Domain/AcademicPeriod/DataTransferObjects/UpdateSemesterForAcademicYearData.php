<?php

namespace Domain\AcademicPeriod\DataTransferObjects;

use Carbon\Carbon;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Casts\DateTimeInterfaceCast;
use Spatie\LaravelData\Data;

class UpdateSemesterForAcademicYearData extends Data
{
    #[WithCast(DateTimeInterfaceCast::class)]
    public Carbon $startDate;

    #[WithCast(DateTimeInterfaceCast::class)]
    public Carbon $endDate;

    public function __construct(
        public int $academicYearId,
        public int $semesterId,
        public string $semester,
        $startDate,
        $endDate
    ) {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public static function rules($context): array
    {
        return [
            'academicYearId' => ['required', 'integer'],
            'semesterId' => ['required', 'integer'],
            'semester' => ['required', 'integer'],
            'startDate' => ['required', 'date'],
            'endDate' => ['required', 'date', 'after:startDate'],
        ];
    }

    public static function prepareForPipeline($properties): array
    {
       $properties['academicYearId'] = request()->route()->parameter('id');

       $properties['semesterId'] = request()->route()->parameter('semester');

       return $properties;
    }
}
