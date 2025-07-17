<?php

namespace Domain\School\Actions;

use Domain\School\DataTransferObjects\AssignAHeadOfDepartmentData;
use Domain\User\Models\User;

class AssignAHeadOfDepartment
{
    public function execute(AssignAHeadOfDepartmentData $data)
    {
        $existingDean = User::role('hod')->where('department_id', $data->departmentId)->first();
        if ($existingDean && $existingDean->id !== $data->userId) {
            throw new \Exception('A Head of Department already exists for this department.');
        }

        $user = User::findOrFail($data->userId);
        $user->department_id = $data->departmentId;
        $user->save();

        $user->syncRoles('hod');

        return $user;
    }
}
