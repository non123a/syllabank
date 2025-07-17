<?php

namespace Domain\User\Actions;

use Domain\User\DataTransferObjects\EnableAStudentData;
use Domain\User\Models\User;

class EnableAStudent
{
    public function execute(EnableAStudentData $enableAStudentData)
    {
        User::role('student')->find($enableAStudentData->id)->update([
            'is_active' => true
        ]);
    }
}

