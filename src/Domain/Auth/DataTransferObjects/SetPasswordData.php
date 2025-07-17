<?php

namespace Domain\Auth\DataTransferObjects;

use Spatie\LaravelData\Data;

class SetPasswordData extends Data
{
    public function __construct(
        public string $email,
        public string $token,
        public string $newPassword,
        public string $confirmNewPassword
    ) {
    }
}
