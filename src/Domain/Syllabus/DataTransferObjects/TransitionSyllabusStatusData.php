<?php

namespace Domain\Syllabus\Actions;

use Spatie\LaravelData\Data;

class TransitionSyllabusStatusData extends Data
{
    public function __construct(
        public $syllabusId,
        public $newStatus,
    ) {
    }
}
