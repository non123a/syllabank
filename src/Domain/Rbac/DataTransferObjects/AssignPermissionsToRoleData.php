<?php

namespace Domain\Rbac\DataTransferObjects;

use Spatie\LaravelData\Data;

class AssignPermissionsToRoleData extends Data
{
    public function __construct(
        public string $role,
        public array $permissions
    ) {
    }
}

