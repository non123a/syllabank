<?php

namespace Database\Seeders;

use Domain\User\Models\User;
use Illuminate\Database\Seeder;

class GradeSeeder extends Seeder
{
    public function run(): void
    {
        $grades = [
            [
                'value' => 90
            ],
            [
                'value' => 85
            ],
            [
                'value' => 95
            ],
            [
                'value' => 100
            ],
            [
                'value' => 80
            ],
            [
                'value' => 75
            ],
            [
                'value' => 85
            ],
            [
                'value' => 90
            ],
            [
                'value' => 95
            ]
        ];

        $grade = \Domain\Class\Models\Grade::make($grades[0]);
        $grade->gradeSubmission()->associate(1);
        $grade->gradeCriteria()->associate(1);
        $grade->save();

        $grade = \Domain\Class\Models\Grade::make($grades[0]);
        $grade->gradeSubmission()->associate(1);
        $grade->gradeCriteria()->associate(2);
        $grade->save();

        $grade = \Domain\Class\Models\Grade::make($grades[1]);
        $grade->gradeSubmission()->associate(1);
        $grade->gradeCriteria()->associate(2);
        $grade->save();

        $grade = \Domain\Class\Models\Grade::make($grades[2]);
        $grade->gradeSubmission()->associate(1);
        $grade->gradeCriteria()->associate(3);
        $grade->save();

        $grade = \Domain\Class\Models\Grade::make($grades[3]);
        $grade->gradeSubmission()->associate(1);
        $grade->gradeCriteria()->associate(4);
        $grade->save();

        $grade = \Domain\Class\Models\Grade::make($grades[4]);
        $grade->gradeSubmission()->associate(1);
        $grade->gradeCriteria()->associate(5);
        $grade->save();

        $grade = \Domain\Class\Models\Grade::make($grades[5]);
        $grade->gradeSubmission()->associate(1);
        $grade->gradeCriteria()->associate(6);
        $grade->save();
    }
}
