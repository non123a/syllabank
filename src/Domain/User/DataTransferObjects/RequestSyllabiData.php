<?php

namespace Domain\User\DataTransferObjects;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

class RequestSyllabiData extends Data
{
    public function __construct(
        public array $courses,
        public string $description,
        public $headOfDepartmentId,
    ) {
    }

    public static function rules(ValidationContext $context): array
    {
        return [
            'courses' => ['required', 'array'],
            'description' => ['required', 'string'],
            'headOfDepartmentId' => ['required', 'integer', 'exists:users,id'],
        ];
    }
}
