<?php

namespace Domain\User\Actions;

use Domain\User\DataTransferObjects\DeleteAnAdminData;
use Domain\User\Models\User;

class DeleteAnAdmin
{
    public function execute(DeleteAnAdminData $deleteAnAdminData)
    {
        User::role('admin')->find($deleteAnAdminData->id)->deleteOrFail();
    }

}
