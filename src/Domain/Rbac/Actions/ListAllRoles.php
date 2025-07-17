<?php

namespace Domain\Rbac\Actions;

use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Cache;

class ListAllRoles
{
    public function execute()
    {
        return Cache::remember('all_roles', 60 * 24, function () {
            return Role::whereNotIn('name', ['super-admin'])->get();
        });
    }
}
