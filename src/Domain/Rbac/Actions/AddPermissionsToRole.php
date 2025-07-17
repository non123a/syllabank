<?php

namespace Domain\Rbac\Actions;

use Domain\Rbac\DataTransferObjects\AddPermissionsToRoleData;
use Spatie\Permission\Models\Role;

class AddPermissionsToRole
{
    public function execute(AddPermissionsToRoleData $addPermissionsToRoleData)
    {
        $role = Role::findByName($addPermissionsToRoleData->role);

        $role->permissions()->syncWithoutDetaching($addPermissionsToRoleData->permissions);
    }
}
