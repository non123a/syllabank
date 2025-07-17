<?php

namespace Domain\Course\DataTransferObjects;

use Spatie\LaravelData\Data;

class AssignACourseToInstructorData extends Data
{
    public function __construct(
        public int $course_assignment_id,
        public array $instructor_ids,
    ) {}
}
