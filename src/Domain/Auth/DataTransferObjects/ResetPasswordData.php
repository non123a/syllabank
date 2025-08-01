<?php

namespace Domain\Auth\DataTransferObjects;

use Spatie\LaravelData\Data;

class ResetPasswordData extends Data
{
    public function __construct(
        public string $token,
        public string $email,
        public string $password,
        public string $confirmPassword
    ) {
    }
}
