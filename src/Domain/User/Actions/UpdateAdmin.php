<?php

namespace Domain\User\Actions;

use Domain\User\Models\User;
use Domain\User\DataTransferObjects\UpdateAdminData;

class UpdateAdmin
{
    public function execute(UpdateAdminData $updateAdminData)
    {
        $admin = User::role('admin')
            ->findOrFail($updateAdminData->id);

        $admin->update([
            'name' => $updateAdminData->name,
        ]);

        return $admin;
    }
}
