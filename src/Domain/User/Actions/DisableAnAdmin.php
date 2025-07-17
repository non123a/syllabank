<?php

namespace Domain\User\Actions;

use Domain\User\DataTransferObjects\DisableAnAdminData;
use Domain\User\Models\User;

class DisableAnAdmin
{
    public function execute(DisableAnAdminData $disableAnAdminData)
    {
        User::role('admin')->find($disableAnAdminData->id)->update([
            'is_active' => false
        ]);
    }
}
