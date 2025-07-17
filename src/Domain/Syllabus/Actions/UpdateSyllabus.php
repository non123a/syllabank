<?php

namespace Domain\Syllabus\Actions;

use Domain\Course\DataTransferObjects\UpdateASyllabusData;
use Domain\Syllabus\Models\Syllabus;

class UpdateSyllabus
{
    public function execute(UpdateASyllabusData $updateASyllabusData)
    {
        $syllabus = Syllabus::findOrFail($updateASyllabusData->syllabusId);

        $syllabus
            ->update(
                collect([
                    'syllabus_name' => $updateASyllabusData->syllabusName,
                    'content' => $updateASyllabusData->content,
                ])
                    ->filter(fn($value) => !is_null($value))
                    ->all()
            );
    }
}
