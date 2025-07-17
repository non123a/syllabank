<?php

namespace Domain\User\Actions;

use Domain\User\Models\User;

class RetrieveUserById
{
    public function execute(int $id): ?User
    {
        return User::with('department', 'roles')->findOrFail($id);
    }
}
