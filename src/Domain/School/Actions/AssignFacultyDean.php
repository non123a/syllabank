<?php

namespace Domain\School\Actions;

use Domain\User\Models\User;

class AssignFacultyDean
{
    public function execute($userId, $departmentId)
    {
        $existingDean = User::role('dean')->where('department_id', $departmentId)->first();
        if ($existingDean && $existingDean->id !== $userId) {
            throw new \Exception('A Dean already exists for this faculty.');
        }

        $user = User::findOrFail($userId);
        $user->department_id = $departmentId;
        $user->save();

        $user->syncRoles('dean');

        return $user;
    }
}