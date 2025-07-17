<?php

namespace App\Management\Resources;

use Domain\Class\Models\Section;
use Illuminate\Database\Eloquent\Collection;
use Spatie\LaravelData\Attributes\MapOutputName;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\LaravelData\Resource;

#[MapOutputName(SnakeCaseMapper::class)]
class MeScheduleResource extends Resource
{
    public function __construct(
        public int $id,
        public int $sectionNumber,
        public string $createdAt,
        public string $updatedAt,
        public string $className,
        public Collection $schedules,
        public $class,
    ) {
    }

    public static function fromModel(Section $section): self
    {
        return new self(
            id: $section->id,
            sectionNumber: $section->section_number,
            createdAt: $section->created_at,
            updatedAt: $section->updated_at,
            className: $section->class->class_name,
            schedules: $section->schedules,
            class: $section->class,
        );
    }

}
