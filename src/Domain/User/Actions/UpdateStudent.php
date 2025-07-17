<?php

namespace Domain\User\Actions;

use Domain\User\DataTransferObjects\UpdateStudentData;
use Domain\User\Models\User;

class UpdateStudent
{
    public function execute(UpdateStudentData $updateStudentData)
    {
        $student = User::role('student')
            ->with([
                'classes' => function ($query) use ($updateStudentData) {
                    $query->where('metadata->english_level', '!=', $updateStudentData->englishLevel);
                }
            ])
            ->findOrFail($updateStudentData->id);

        if ($student->classes->isNotEmpty()) {
            throw new \RuntimeException('Cannot update English level. Classes with different English levels exist.');
        }

        $student->update([
            'name' => $updateStudentData->name,
            'metadata' => [
                'english_level' => $updateStudentData->englishLevel
            ],
        ]);

        return $student;
    }
}

