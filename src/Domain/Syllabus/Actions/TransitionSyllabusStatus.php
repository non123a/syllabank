<?php

namespace Domain\Syllabus\Actions;

use Domain\Syllabus\Models\Syllabus;

class TransitionSyllabusStatus
{
    public function execute(TransitionSyllabusStatusData $transitionSyllabusStatusData)
    {
        /**
         * @var Syllabus $syllabus
         */
        $syllabus = Syllabus::findOrFail($transitionSyllabusStatusData->syllabusId);

        if (!(in_array($transitionSyllabusStatusData->newStatus, $syllabus->status->transitionableStates()))) {
            throw new \Exception('Invalid status transition');
        }

        if ($transitionSyllabusStatusData->newStatus === 'published') {
            $syllabus->status->transitionTo('published');
        }

        if ($transitionSyllabusStatusData->newStatus === 'draft') {
            $syllabus->status->transitionTo('draft');
        }

        // Add more status transitions here
    }
}
