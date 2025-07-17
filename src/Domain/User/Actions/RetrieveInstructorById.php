<?php

namespace Domain\User\Actions;

use Domain\User\Models\User;

class RetrieveInstructorById
{
    public function execute(int $id)
    {
        return User::role('instructor')->findOrFail($id);
    }
}
