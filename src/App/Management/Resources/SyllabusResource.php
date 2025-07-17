<?php

namespace App\Management\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SyllabusResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'course' => $this->course ? [
                'id' => $this->course->id,
                'name' => $this->course->course_name,
                'subject' => $this->course->course_subject,
                'code' => $this->course->course_code,
            ] : null,
            'last_modified_by' => $this->last_modified_by,
            'academic_year_start' => $this->academic_year_start,
            'academic_year_end' => $this->academic_year_end,
            'semester_number' => $this->semester_number,
            'syllabus_name' => $this->syllabus_name,
            'sections' => $this->sections,
            'status' => $this->status,
            'is_file_upload' => $this->is_file_upload,
            'status_timeline' => $this->status_timeline,
            'author_id' => $this->author_id,
            'author_name' => $this->author->name ?? null,
            'author_identification' => $this->author->identification_number ?? null,
            'author_email' => $this->author->email ?? null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'course_assignment_id' => $this->course_assignment_id,
        ];
    }
}