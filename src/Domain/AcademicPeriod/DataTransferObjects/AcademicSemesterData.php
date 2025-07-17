<?php

namespace Domain\AcademicPeriod\DataTransferObjects;

use Spatie\LaravelData\Data;

class AcademicSemesterData extends Data
{
    public function __construct(
        public string $name,
        public string $startDate,
        public string $endDate
    ) {
    }
}
