<?php

namespace Domain\Syllabus\Actions;

use Domain\Syllabus\Models\Syllabus;

class RetrieveSyllabusById
{
    public function execute($id)
    {
        return Syllabus::findOrFail($id);
    }
}