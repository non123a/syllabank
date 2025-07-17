<?php

namespace Domain\Syllabus\DataTransferObjects;

use Spatie\LaravelData\Data;

class CreateASyllabusData extends Data
{
    public function __construct(
        public int $assignmentId,
        public string $sections,
        public bool $isFileUpload,
        public int $credits,
        public int $author_id,
        public string $author_name,
        public ?int $templateId = null,
        public ?string $latexTemplate = null,
        public $pdfFile = null,
        public string $status = 'draft'
    ) {}
}