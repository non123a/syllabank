<?php

namespace Domain\Auth\DataTransferObjects;

use Spatie\LaravelData\Data;

class SignInData extends Data
{
    public function __construct(
        public string $email,
        public string $password,
        public ?string $ip,
        public ?bool $rememberMe
    ) {
        $this->ip = request()->ip();
    }
}
