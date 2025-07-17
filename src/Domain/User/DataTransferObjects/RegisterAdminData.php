<?php

namespace Domain\User\DataTransferObjects;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

class RegisterAdminData extends Data
{
    public function __construct(
        public string $identification,
        public string $email,
        public string $name,
    ) {
    }

    public static function rules(ValidationContext $context): array
    {
        return [
            'identification' => 'required|unique:users,identification_number',
            'email' => 'required|email|unique:users,email',
            'name' => 'required',
        ];
    }
}
