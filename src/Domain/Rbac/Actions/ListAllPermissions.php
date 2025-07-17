<?php

namespace Domain\Rbac\Actions;

use Spatie\Permission\Models\Permission;

class ListAllPermissions
{
    public function execute()
    {
        return Permission::all();
    }
}
