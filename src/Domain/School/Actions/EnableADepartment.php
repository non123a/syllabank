<?php

namespace Domain\School\Actions;

use Domain\School\DataTransferObjects\EnableADepartmentData;
use Domain\School\Models\Department;

class EnableADepartment
{
    public function execute(EnableADepartmentData $EnableADepartmentData)
    {
        Department::findOrFail($EnableADepartmentData->id)->update([
            'is_active' => true
        ]);
    }
}
