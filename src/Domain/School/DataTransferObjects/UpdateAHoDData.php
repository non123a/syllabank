<?php

namespace Domain\School\DataTransferObjects;

use Spatie\LaravelData\Data;

class UpdateAHoDData extends Data
{
    public function __construct(
        public string $userId,
        public string $department_id,
    ) {}
}
