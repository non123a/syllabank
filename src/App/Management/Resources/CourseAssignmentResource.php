<?php

namespace App\Management\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CourseAssignmentResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'course_code' => $this->course_code,
            'course_name' => $this->course_name,
            'course_subject' => $this->course_subject,
            'academic_year' => $this->academic_year,
            'semester' => $this->semester,
            'instructors' => InstructorResource::collection($this->whenLoaded('instructors')),
        ];
    }
}
