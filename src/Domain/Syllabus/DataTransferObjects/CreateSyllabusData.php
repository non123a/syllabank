<?php

namespace Domain\Syllabus\DataTransferObjects;

use Spatie\LaravelData\Data;

class CreateSyllabusData extends Data
{
    public function __construct(
        public int $course_id,
        public string $sections,
        public int $credits,
        public int $template_id,
        public string $content,
    ) {}
}
