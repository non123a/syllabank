<?php

namespace Domain\AcademicPeriod\DataTransferObjects;

use Illuminate\Support\Carbon;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Casts\DateTimeInterfaceCast;
use Spatie\LaravelData\Data;

class CreateAcademicYearData extends Data
{
    #[WithCast(DateTimeInterfaceCast::class)]
    public Carbon $startDate;

    #[WithCast(DateTimeInterfaceCast::class)]
    public Carbon $endDate;

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public static function rules($context): array
    {
        return [
            'startDate' => ['required', 'date'],
            'endDate' => ['required', 'date', 'after:startDate'],
        ];
    }
}
