<?php

namespace Domain\Course\Actions;

use Domain\Course\DataTransferObjects\AssignACourseToInstructorData;
use Domain\User\Models\User;
use Illuminate\Support\Facades\DB;

class AssignACourseToInstructor
{
    public function execute(AssignACourseToInstructorData $assignACourseToInstructorData)
    {
        return DB::transaction(function () use ($assignACourseToInstructorData) {
            $courseAssignment = DB::table('courses_academic_years_semesters_users')
                ->where('id', $assignACourseToInstructorData->course_assignment_id)
                ->first();

            if (!$courseAssignment) {
                throw new \Exception('Course assignment not found.');
            }

            // For PUT request, we replace all existing instructors with the new ones
            $newInstructorIds = array_unique($assignACourseToInstructorData->instructor_ids);

            // Check if any of the new instructor IDs are invalid
            $validInstructorIds = User::whereIn('id', $newInstructorIds)->pluck('id')->toArray();
            $invalidInstructorIds = array_diff($newInstructorIds, $validInstructorIds);

            if (!empty($invalidInstructorIds)) {
                throw new \Exception("The following instructor IDs are invalid: " . implode(', ', $invalidInstructorIds));
            }

            $instructorIds = implode(',', $validInstructorIds);

            // Update the existing row, replacing all instructor IDs
            DB::table('courses_academic_years_semesters_users')
                ->where('id', $assignACourseToInstructorData->course_assignment_id)
                ->update([
                    'instructor_id' => $instructorIds,
                    'head_of_dept_id' => auth()->user()->id,
                    'department' => auth()->user()->department->code_name,
                    'updated_at' => now(),
                ]);

            return [
                'success' => true,
                'message' => 'Instructors assigned successfully.'
            ];
        });
    }
}
