<?php

namespace Domain\Course\DataTransferObjects;

use Spatie\LaravelData\Data;

class CourseAssignmentData extends Data
{
    public function __construct(
        public readonly int $course_id,
        public readonly int $academic_year_id,
        public readonly int $semester_id
    ) {}
}
