<?php

namespace Domain\Syllabus\Actions;

use Domain\Syllabus\Models\Syllabus;
use Illuminate\Support\Facades\Storage;

class UploadSyllabusFile
{
    public function execute($data)
    {
        $path = $data->file->store('syllabi');
        $syllabus = Syllabus::create([
            'course_id' => $data->course_id,
            'instructor_id' => auth()->id(),
            'pdf_file_path' => $path,
            'sections' => $data->sections,
            'credits' => $data->credits,
            'syllabus_name' => $data->syllabus_name,
            'status' => 'draft',
            'content' => '', // Empty content for file uploads
        ]);
        return $syllabus;
    }
}
