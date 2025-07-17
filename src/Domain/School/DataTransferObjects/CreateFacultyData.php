<?php

namespace Domain\School\DataTransferObjects;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;

class CreateFacultyData extends Data
{
    public function __construct(
        #[MapInputName('code_name')]
        public string $codeName,
        #[MapInputName('full_name')]
        public string $fullName,
        public ?string $description = null
    ) {}

    public static function rules(): array
    {
        return [
            'code_name' => ['required', 'string', 'max:255'],
            'full_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ];
    }
}