<?php

namespace Domain\Course\DataTransferObjects;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Domain\Course\Models\Course;

class CreateCourseData extends Data
{
    public function __construct(
        public string $subject,
        public string $name,
        public string $code,
        public ?string $description,
        public ?bool $isActive = true,
    ) {}
    public function checkExistingCourse(): ?Course
    {
        return Course::where("course_subject", $this->subject)
            ->where("course_code", $this->code)
            ->first();
    }
}
