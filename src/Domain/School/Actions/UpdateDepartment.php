<?php

namespace Domain\School\Actions;

use Domain\School\DataTransferObjects\UpdateDepartmentData;
use Domain\School\Models\Department;
use Illuminate\Support\Facades\DB;

class UpdateDepartment
{
    public function execute(UpdateDepartmentData $updateDepartmentData): Department
    {
        DB::beginTransaction();

        try {
            $department = Department::findOrFail($updateDepartmentData->departmentId);

            $department->update([
                'full_name' => $updateDepartmentData->full_name,
                'code_name' => $updateDepartmentData->code_name,
                'description' => $updateDepartmentData->description,
            ]);

            $department->faculty()->associate($updateDepartmentData->facultyId);

            $department->save();

            DB::commit();

            return $department->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
        return $department->wasRecentlyCreated;
    }
}
