<?php

namespace App\Management\Resources;

use Domain\Course\Models\Course;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapOutputName;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\LaravelData\Data;

#[MapOutputName(SnakeCaseMapper::class)]
class CourseResource extends Data
{
    public function __construct(
        public ?int $id,
        public string $courseSubject,
        public string $courseName,
        public string $courseCode,
        public ?string $description,
        public bool $isActive,
        public string $createdAt,
        public string $updatedAt,
    ) {}

    public static function fromModel(Course $course)
    {
        return new self(
            id: $course->id,
            courseSubject: $course->course_subject,
            courseName: $course->course_name,
            courseCode: $course->course_code,
            description: $course->description,
            isActive: $course->is_active,
            createdAt: $course->created_at->toDateTimeString(),
            updatedAt: $course->updated_at->toDateTimeString(),
        );
    }
}
