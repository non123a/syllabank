<?php

namespace Domain\Course\DataTransferObjects;

use Spatie\LaravelData\Data;

class AssignCourseToAcademicPeriodData extends Data
{
    public function __construct(
        public int $course_id,
        public int $academic_year_id,
        public int $semester_id,
    ) {}
}
