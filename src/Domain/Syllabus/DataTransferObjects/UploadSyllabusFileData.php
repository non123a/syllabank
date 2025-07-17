<?php

namespace Domain\Syllabus\DataTransferObjects;

use Spatie\LaravelData\Data;
use Illuminate\Http\UploadedFile;

class UploadSyllabusFileData extends Data
{
    public function __construct(
        public UploadedFile $file,
        public int $course_id,
        public string $sections,
        public int $credits,
        public string $syllabus_name,
    ) {}
}
