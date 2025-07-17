<?php

namespace Domain\User\Actions;

use Domain\User\DataTransferObjects\EnableAnAdminData;
use Domain\User\Models\User;

class EnableAnAdmin
{
    public function execute(EnableAnAdminData $enableAnAdminData)
    {
        User::role('admin')->find($enableAnAdminData->id)->update([
            'is_active' => true
        ]);
    }
}
