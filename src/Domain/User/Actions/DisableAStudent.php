<?php

namespace Domain\User\Actions;

use Domain\User\DataTransferObjects\DisableAStudentData;
use Domain\User\Models\User;

class DisableAStudent
{
    public function execute(DisableAStudentData $disableAStudentData)
    {
        User::role('student')->find($disableAStudentData->id)->update([
            'is_active' => false
        ]);
    }
}
