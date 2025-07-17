<?php

namespace Domain\User\DataTransferObjects;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;
use Illuminate\Validation\Rule;

class RegisterUserData extends Data
{
    public function __construct(
        public string $identification_number,
        public string $email,
        public string $name,
        public int $departmentId,
        public $roleIds
    ) {}

    public static function rules(ValidationContext $context): array
    {
        return [
            'identification_number' => 'required|string',
            'email' => ['required', 'email', 'regex:/^.+@paragoniu\.edu\.kh$/i'],
            'name' => 'required|string',
            'departmentId' => 'required|exists:departments,id',
            'roleIds' => 'required|array',
            'roleIds.*' => 'required|int|exists:roles,id',
        ];
    }
}
