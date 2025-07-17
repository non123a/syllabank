<?php

namespace Domain\User\Actions;

use Domain\User\Models\User;

class EnableAUser
{
    public function execute($id)
    {
        $result = User::query()->where('id', $id)->update(['is_active' => true]);

        if (!$result) {
            throw new \RuntimeException('Failed to disable user');
        }

        return $result;
    }
}
