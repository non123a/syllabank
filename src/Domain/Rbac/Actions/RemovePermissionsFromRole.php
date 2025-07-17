<?php

namespace Domain\Rbac\Actions;

use Domain\Rbac\DataTransferObjects\RemovePermissionsFromRoleData;
use Spatie\Permission\Models\Role;

class RemovePermissionsFromRole
{
    public function execute(RemovePermissionsFromRoleData $removePermissionsFromRoleData)
    {
        $role = Role::findByName(
            $removePermissionsFromRoleData->role
        );

        $role->permissions()->detach($removePermissionsFromRoleData->permissions);

        return $role;
    }
}
