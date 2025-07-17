<?php

namespace Domain\Course\DataTransferObjects;

use Spatie\LaravelData\Data;

class RemoveACourseFromInstructorData extends Data
{
    public function __construct(
        public string $courseId,
        public string $instructorId
    ) {
    }
}
