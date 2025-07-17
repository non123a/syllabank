<?php

namespace Domain\Syllabus\DataTransferObjects;

use Spatie\LaravelData\Data;
use Illuminate\Http\UploadedFile;

class SaveSyllabusProgressData extends Data
{
    public function __construct(
        public ?string $content = null,
        public ?UploadedFile $pdfFile = null,
    ) {}
}
