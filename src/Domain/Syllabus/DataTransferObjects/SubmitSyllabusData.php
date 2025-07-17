<?php

namespace Domain\Syllabus\DataTransferObjects;

use Spatie\LaravelData\Data;

class SubmitSyllabusData extends Data
{
    public function __construct(
        public int $id,
    ) {}
}
