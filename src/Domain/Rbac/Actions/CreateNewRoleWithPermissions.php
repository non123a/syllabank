<?php

namespace Domain\Rbac\Actions;

use Domain\Rbac\DataTransferObjects\CreateNewRoleWithPermissionsData;
use Spatie\Permission\Models\Role;

class CreateNewRoleWithPermissions
{
    public function execute(CreateNewRoleWithPermissionsData $createNewRoleWithPermissionsData)
    {
        $role = Role::create([
            'name' => $createNewRoleWithPermissionsData->role,
        ]);

        $role->permissions()->sync($createNewRoleWithPermissionsData->permissions);

        return $role;
    }
}
