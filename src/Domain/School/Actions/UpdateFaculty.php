<?php

namespace Domain\School\Actions;

use Domain\School\Models\Faculty;
use Domain\School\DataTransferObjects\UpdateFacultyData;
use Illuminate\Support\Facades\DB;

class UpdateFaculty
{
    public function execute(UpdateFacultyData $data): Faculty
    {
        DB::beginTransaction();

        try {
            $faculty = Faculty::findOrFail($data->facultyId);

            $faculty->update([
                'full_name' => $data->full_name,
                'code_name' => $data->code_name,
                'description' => $data->description,
            ]);

            $faculty->save();

            DB::commit();

            return $faculty->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
        return $faculty->wasRecentlyCreated;
    }
}
