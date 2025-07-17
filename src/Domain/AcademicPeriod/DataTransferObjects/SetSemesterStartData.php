<?php

namespace Domain\AcademicPeriod\DataTransferObjects;

use Spatie\LaravelData\Data;

class SetSemesterStartData extends Data
{
    public function __construct(
        public int $semesterName,
        public string $startDate,
    ) {
    }
}
