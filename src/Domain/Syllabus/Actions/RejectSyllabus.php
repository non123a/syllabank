<?php

namespace Domain\Syllabus\Actions;

use Domain\Syllabus\Models\Syllabus;
use Domain\Syllabus\States\SyllabusState;
use Domain\User\Models\User;
use Illuminate\Support\Facades\Auth;

class RejectSyllabus
{
    public function execute($data)
    {
        $syllabus = Syllabus::findOrFail($data['id']);
        $currentStatus = $syllabus->status;

        $nextStatus = SyllabusState::REJECTED;
        $nextReceiver = null;

        $this->updateSyllabusStatus($syllabus, $nextStatus, $nextReceiver);

        return $syllabus;
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
                    'content' => 'Rejected',
                    'created_at' => now()->toIso8601String(),
                ]
            ]
        ];

        $syllabus->status = $nextStatus;
        $syllabus->receiver_id = $nextReceiver ? $nextReceiver->id : null;

        $currentStatusTimeline = $syllabus->status_timeline ? json_decode($syllabus->status_timeline, true) : [];
        $currentStatusTimeline[] = $newStatusTimeline;

        $syllabus->status_timeline = json_encode($currentStatusTimeline);
        $syllabus->last_modified_by = $currentUser->name;

        $syllabus->save();
    }
}