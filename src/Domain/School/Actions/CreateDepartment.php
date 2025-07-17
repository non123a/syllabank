<?php

namespace Domain\School\Actions;

use Domain\School\Models\Department;
use Domain\School\DataTransferObjects\CreateDepartmentData;
use Domain\School\Models\Faculty;
use Illuminate\Support\Facades\DB;

class CreateDepartment
{
    public function execute(CreateDepartmentData $createDepartmentData)
    {
        DB::beginTransaction();
        try {

            if (Department::where('code_name', $createDepartmentData->codeName)->exists()) {
                throw new \App\Exceptions\DepartmentCodenameAlreadyExists();
            }

            $department = Department::make([
                'code_name' => $createDepartmentData->codeName,
                'full_name' => $createDepartmentData->fullName,
                'description' => $createDepartmentData->description,
            ]);

            $department->faculty()->associate($createDepartmentData->facultyId);

            $department->save();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return $department->wasRecentlyCreated;
    }
}
