<?php

namespace Domain\Course\DataTransferObjects;

use Spatie\LaravelData\Data;

class RemoveACourseSectionFromInstructorData extends Data
{
    public function __construct(
        public $sectionId,
    ) {
    }
}
