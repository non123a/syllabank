<?php

namespace Domain\Syllabus\Actions;

use Domain\Syllabus\Models\Syllabus;
use Illuminate\Support\Facades\Auth;

class AddCommentToSyllabus
{
    public function execute($id, $data)
    {
        $syllabus = Syllabus::findOrFail($id);
        $this->addCommentToStatus($syllabus, $data['content'], $data['eventId']);
        return $syllabus;
    }

    private function addCommentToStatus(Syllabus $syllabus, $content, $eventId)
    {
        $statusTimeline = is_array($syllabus->status_timeline)
            ? $syllabus->status_timeline
            : json_decode($syllabus->status_timeline, true) ?? [];

        $statusIndex = array_search($eventId, array_column($statusTimeline, 'status'));

        if ($statusIndex === false) {
            $statusTimeline[] = [
                'status' => $eventId,
                'date' => now()->toIso8601String(),
                'comments' => []
            ];
            $statusIndex = count($statusTimeline) - 1;
        }

        $statusTimeline[$statusIndex]['comments'][] = [
            'from' => [
                'name' => Auth::user()->name,
                'id' => Auth::id()
            ],
            'content' => $content,
            'created_at' => now()->toIso8601String(),
        ];

        $syllabus->status_timeline = json_encode($statusTimeline);
        $syllabus->last_modified_by = Auth::user()->name;
        $syllabus->save();
    }
}