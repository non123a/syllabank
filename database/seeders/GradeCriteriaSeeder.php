<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class GradeCriteriaSeeder extends Seeder
{
    public function run(): void
    {
        $gradeCriteria = [
            [
                'criteria_name' => 'Projects',
            ],
            [
                'criteria_name' => 'Writing',
            ],
            [
                'criteria_name' => 'End-of-Module Test',
            ],
            [
                'criteria_name' => 'Attendance',
            ],
            [
                'criteria_name' => 'Overall Performance',
            ],
            [
                'criteria_name' => 'Summer',
            ],
        ];

        foreach ($gradeCriteria as $criteria) {
            \Domain\Class\Models\GradeCriteria::create($criteria);
        }
    }
}
