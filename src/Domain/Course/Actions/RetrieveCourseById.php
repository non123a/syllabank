<?php

namespace Domain\Course\Actions;

use Domain\Course\Models\Course;

class RetrieveCourseById
{
    public function execute(int $id)
    {
        return Course::findOrFail($id);
    }
}
