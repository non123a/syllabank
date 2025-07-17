<?php

namespace Domain\School\Actions;

use Domain\School\DataTransferObjects\UpdateAHoDData;
use Domain\School\Models\Department;
use Domain\User\Models\User;

class UpdateAHoD
{
    public function execute(Department $department, UpdateAHoDData $data): void
    {
        // Remove HoD role from the current HoD if exists
        if ($currentHoD = $department->headOfDepartment) {
            $currentHoD->removeRole('hod');
        }

        // Find the new HoD user
        $newHoD = User::findOrFail($data->userId);

        // Assign HoD role to the new user
        $newHoD->assignRole('hod');

        // Update the department's head of department
        $department->update(['head_of_department_id' => $newHoD->id]);
    }
}
