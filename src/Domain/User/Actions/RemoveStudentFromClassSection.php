<?php

namespace Domain\User\Actions;

use Domain\User\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class RemoveStudentFromClassSection
{
    public function execute($sectionId, $studentId)
    {
        DB::transaction(function () use ($sectionId, $studentId) {
            /**
             * @var User $student
             */
            $student = User::role('student')->findOrFail($studentId);

            $student
                ->gradeSubmissions()
                ->whereHas('section', function (Builder $query) use ($sectionId, $studentId) {
                    $query
                        ->where('class_sections.id', $sectionId)
                        ->where('student_id', $studentId);
                })
                ->delete();

            $student->sections()->detach([$sectionId]);
        });
    }
}
