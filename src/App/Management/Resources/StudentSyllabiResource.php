<?php

namespace App\Management\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

class StudentSyllabiResource extends JsonResource
{
    public function toArray($request)
    {
        $instructors = $this->getInstructors();

        return [
            'id' => $this->id,
            'syllabus_name' => $this->syllabus_name,
            'sections' => $this->sections,
            'course_id' => $this->course_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'instructors' => $instructors,
        ];
    }

    private function getInstructors()
    {
        $instructors = DB::table('courses_academic_years_semesters_users')
            ->join('users', DB::raw("users.id::text"), '=', DB::raw("ANY(string_to_array(courses_academic_years_semesters_users.instructor_id, ','))"))
            ->where('courses_academic_years_semesters_users.id', $this->course_assignment_id)
            ->pluck('users.name')
            ->toArray();

        return implode(', ', $instructors);
    }
}
