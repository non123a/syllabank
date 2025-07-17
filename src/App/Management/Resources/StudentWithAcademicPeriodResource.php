<?php

namespace App\Management\Resources;

use Domain\AcademicPeriod\Models\AcademicYear;
use Domain\User\Models\User;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapOutputName;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\LaravelData\Data;

#[MapOutputName(SnakeCaseMapper::class)]
class StudentWithAcademicPeriodResource extends Data
{
    public function __construct(
        public int $id,
        public string $identificationNumber,
        public string $name,
        public string $email,
        public bool $isActive,
        public string $createdAt,
        public string $updatedAt,
        public object $metadata,
        public $academicSemesters,
    ) {
    }

    public static function fromModel(User $student)
    {
        return new self(
            id: $student->id,
            identificationNumber: $student->identification_number,
            name: $student->name,
            email: $student->email,
            isActive: $student->is_active,
            createdAt: $student->created_at,
            updatedAt: $student->updated_at,
            metadata: $student->metadata,
            academicSemesters: $student->semesters,
        );
    }
}
