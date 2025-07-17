<?php

namespace Domain\Syllabus\DataTransferObjects;

use Spatie\LaravelData\Data;

class CreateSyllabusFromTemplateData extends Data
{
    public function __construct(
        public string $courseId,
        public string $syllabusName,
        public string $content,
        public string $status,
        public string $logo_path,
        public string $course_code,
        public string $academic_year,
        public string $semester,
        public string $credits,
    ) {}
}
