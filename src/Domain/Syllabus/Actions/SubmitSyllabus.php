<?php

namespace Domain\Syllabus\Actions;

use Domain\Syllabus\Models\Syllabus;
use Domain\User\Models\User;
use Domain\Syllabus\States\SyllabusState;
use Domain\School\Models\Department;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SubmitSyllabus
{
    public function execute($data)
    {
        $syllabus = Syllabus::findOrFail($data->id);
        $currentStatus = $syllabus->status;

        $courseAssignment = DB::table('courses_academic_years_semesters_users')
            ->where('id', $syllabus->course_assignment_id)
            ->first();

        if (!$courseAssignment) {
            throw new \Exception('Course assignment not found');
        }

        $departmentCodeName = $courseAssignment->department;

        switch ($currentStatus) {
            case SyllabusState::DRAFT:
                $nextStatus = SyllabusState::SUBMIT_TO_HEAD_OF_DEPARTMENT;
                $nextReceiver = $this->getHOD($departmentCodeName);
                break;
            case SyllabusState::SUBMIT_TO_HEAD_OF_DEPARTMENT:
                $nextStatus = SyllabusState::VOUCHED_TO_DEAN;
                $nextReceiver = $this->getDean($departmentCodeName);
                break;
            case SyllabusState::VOUCHED_TO_DEAN:
                $nextStatus = SyllabusState::ACCEPTED_BY_PROVOST;
                $nextReceiver = $this->getProvost();
                break;
            case SyllabusState::ACCEPTED_BY_PROVOST:
                $nextStatus = SyllabusState::APPROVED;
                $nextReceiver = null;
                $this->deactivateCourseAssignment($syllabus);
                break;
            case SyllabusState::REJECTED:
                $nextStatus = SyllabusState::SUBMIT_TO_HEAD_OF_DEPARTMENT;
                $nextReceiver = $this->getHOD($departmentCodeName);
                break;
            default:
                throw new \Exception('Invalid syllabus status for submission');
        }

        $this->updateSyllabusStatus($syllabus, $nextStatus, $nextReceiver);

        return $syllabus;
    }

    private function deactivateCourseAssignment(Syllabus $syllabus)
    {
        DB::table('courses_academic_years_semesters_users')
            ->where('id', $syllabus->course_assignment_id)
            ->update(['is_active' => false]);
    }

    private function updateSyllabusStatus(Syllabus $syllabus, string $nextStatus, ?User $nextReceiver)
    {
        $currentUser = Auth::user();
        $newStatusTimeline = [
            'status' => $nextStatus,
            'date' => now()->toIso8601String(),
            'comments' => [
                [
                    'from' => [
                        'name' => $currentUser->name,
                        'id' => $currentUser->id
                    ],
                    'content' => "Status changed to {$nextStatus}",
                    'created_at' => now()->toIso8601String(),
                ]
            ]
        ];

        $syllabus->status = $nextStatus;
        $syllabus->receiver_id = $nextReceiver ? $nextReceiver->id : null;
        $syllabus->last_modified_by = $currentUser->name;

        $currentStatusTimeline = $syllabus->status_timeline ? json_decode($syllabus->status_timeline, true) : [];
        $currentStatusTimeline[] = $newStatusTimeline;

        $syllabus->status_timeline = json_encode($currentStatusTimeline);

        $syllabus->save();
    }

    private function getHOD($departmentCodeName)
    {
        $department = Department::where('code_name', $departmentCodeName)->firstOrFail();
        return User::role('hod')
            ->where('department_id', $department->id)
            ->firstOrFail();
    }

    private function getDean($departmentCodeName)
    {
        $department = Department::where('code_name', $departmentCodeName)->firstOrFail();
        return User::role('dean')
            ->whereHas('department.faculty', function ($query) use ($department) {
                $query->whereHas('departments', function ($subQuery) use ($department) {
                    $subQuery->where('id', $department->id);
                });
            })
            ->firstOrFail();
    }

    private function getProvost()
    {
        return User::role('provost')->firstOrFail();
    }
}
