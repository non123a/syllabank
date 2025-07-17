<?php

namespace Domain\Rbac\Actions;

use Domain\Rbac\DataTransferObjects\AssignPermissionsToRoleData;
use Spatie\Permission\Models\Role;

class AssignPermissionsToRole
{
    public function execute(AssignPermissionsToRoleData $assignPermissionsToRoleData)
    {
        $role = Role::findByName($assignPermissionsToRoleData->role);

        $role->permissions()->sync($assignPermissionsToRoleData->permissions);

        return $role;
    }
}
