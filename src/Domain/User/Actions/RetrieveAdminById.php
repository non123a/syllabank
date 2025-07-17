<?php

namespace Domain\User\Actions;

use Domain\User\DataTransferObjects\RetrieveAdminByIdData;
use Domain\User\Models\User;

class RetrieveAdminById
{
    public function execute(RetrieveAdminByIdData $retrieveAdminByIdData)
    {
        return User::role('admin')
            ->findOrFail($retrieveAdminByIdData->id);
    }
}
