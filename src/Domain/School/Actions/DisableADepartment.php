<?php

namespace Domain\School\Actions;

use Domain\School\DataTransferObjects\DisableADepartmentData;
use Domain\School\Models\Department;

class DisableADepartment
{
    public function execute(DisableADepartmentData $disableADepartmentData)
    {
        Department::findOrFail($disableADepartmentData->id)->update([
            'is_active' => false
        ]);
    }
}
