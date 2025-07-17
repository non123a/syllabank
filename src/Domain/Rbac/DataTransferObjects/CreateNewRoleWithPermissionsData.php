<?php

namespace Domain\Rbac\DataTransferObjects;

use Spatie\LaravelData\Data;

class CreateNewRoleWithPermissionsData extends Data
{
    public function __construct(
        public string $role,
        public array $permissions
    ) {
    }
}
