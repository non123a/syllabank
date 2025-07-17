<?php

namespace Domain\School\DataTransferObjects;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;

class CreateDepartmentData extends Data
{
    public function __construct(
        #[MapInputName('code_name')]
        public string $codeName,
        #[MapInputName('full_name')]
        public ?string $fullName,
        #[MapInputName('faculty_id')]
        public int $facultyId,
        public ?string $description
    ) {}

    public static function rules(): array
    {
        return [
            'code_name' => ['required', 'string', 'max:255', 'unique:departments,code_name'],
            'full_name' => ['nullable', 'string', 'max:255'],
            'faculty_id' => ['required', 'integer', 'exists:faculties,id'],
            'description' => ['nullable', 'string'],
        ];
    }
}
