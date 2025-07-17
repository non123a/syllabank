<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class GradeSubmissionSeeder extends Seeder
{
    public function run(): void
    {
        $submission = \Domain\Class\Models\GradeSubmission::make();

        $submission->student()->associate(2);
        $submission->gradeApprovalRequest()->associate(1);
        $submission->save();
    }
}

