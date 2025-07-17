<?php

namespace Domain\Auth\DataTransferObjects;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class RegisterUserData extends Data
{
    public function __construct(
        public string $name,
        public string $email,
        public string $identification,
        public $metadata,
        public $department_id
    ) {}
}