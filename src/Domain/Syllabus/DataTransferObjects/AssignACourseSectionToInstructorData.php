<?php

namespace Domain\Course\DataTransferObjects;

use Spatie\LaravelData\Data;

class AssignACourseSectionToInstructorData extends Data
{
    public function __construct(
        public $sectionId,
        public $instructorId
    ) {
    }
}
