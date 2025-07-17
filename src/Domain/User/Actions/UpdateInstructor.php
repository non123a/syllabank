<?php

namespace Domain\User\Actions;

use Domain\User\DataTransferObjects\UpdateInstructorData;
use Domain\User\Models\User;

class UpdateInstructor
{
    public function execute(UpdateInstructorData $updateInstructorData)
    {
        $user = User::query()
            ->findOrFail($updateInstructorData->id)->update([
                    'name' => $updateInstructorData->name,
                ]);

        return $user;
    }
}
