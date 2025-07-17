<?php

namespace Domain\School\Actions;

use Domain\School\DataTransferObjects\EnableAFacultyData;
use Domain\School\Models\Department;
use Domain\School\Models\Faculty;

class EnableAFaculty
{
    public function execute(EnableAFacultyData $EnableAFacultyData)
    {
        Faculty::findOrFail($EnableAFacultyData->id)->update([
            'is_active' => true
        ]);

        Department::where('faculty_id', $EnableAFacultyData->id)->update([
            'is_active' => true
        ]);
    }
}
