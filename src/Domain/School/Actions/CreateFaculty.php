<?php

namespace Domain\School\Actions;

use Domain\School\Models\Faculty;
use Domain\School\Models\Department;
use Domain\School\DataTransferObjects\CreateFacultyData;
use Illuminate\Support\Facades\DB;

class CreateFaculty
{
    public function execute(CreateFacultyData $createFacultyData)
    {
        DB::beginTransaction();
        try {
            if (Faculty::where('code_name', $createFacultyData->codeName)->exists()) {
                throw new \Exception('Faculty codename already exists.');
            }

            $faculty = Faculty::create([
                'code_name' => $createFacultyData->codeName,
                'full_name' => $createFacultyData->fullName,
                'description' => $createFacultyData->description,
            ]);

            // Create a STAFF department for the new faculty with hard-coded values
            Department::create([
                'code_name' => 'STAFF',
                'full_name' => $faculty->full_name . ' Staff',
                'description' => 'Reserve department for ' . $faculty->full_name . ' staff only',
                'faculty_id' => $faculty->id,
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return $faculty->fresh();
    }
}