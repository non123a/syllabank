<?php

namespace App\Domain\Syllabus\Actions;

use App\Domain\Syllabus\Models\SyllabusRequestForm;
use Illuminate\Http\Request;

class CreateSyllabusRequestForm
{
    public function execute(Request $request)
    {
        $data = $request->validate([
            'forms' => 'required|array',
        ]);
    }
}
