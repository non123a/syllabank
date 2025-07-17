<?php

namespace Domain\Course\DataTransferObjects;

use Spatie\LaravelData\Data;

class UpdateASyllabusData extends Data
{
    public function __construct(
        public $syllabusId,
        public ?string $syllabusName,
        public $content,
    ) {
    }
}
