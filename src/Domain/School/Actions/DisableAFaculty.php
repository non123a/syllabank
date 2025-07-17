<?php

namespace Domain\School\Actions;

use Domain\School\DataTransferObjects\DisableAFacultyData;
use Domain\School\Models\Department;
use Domain\School\Models\Faculty;

class DisableAFaculty
{
    public function execute(DisableAFacultyData $disableAFacultyData)
    {
        Faculty::findOrFail($disableAFacultyData->id)->update([
            'is_active' => false
        ]);

        Department::where('faculty_id', $disableAFacultyData->id)->update([
            'is_active' => false
        ]);
    }
}
