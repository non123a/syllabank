<?php

namespace Domain\Course\DataTransferObjects;

use Spatie\LaravelData\Data;

class CreateACourseSectionData extends Data
{
    public function __construct(
        public $courseId,
        public $sectionName,
        public $authorId,
    ) {
    }
}
