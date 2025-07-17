<?php

namespace Domain\User\Actions;

use Domain\User\Models\User;

class DisableAUser
{
    public function execute($id)
    {
        $result = User::query()->where('id', $id)->update(['is_active' => false]);

        if (!$result) {
            throw new \RuntimeException('Failed to disable user');
        }

        return $result;
    }
}
