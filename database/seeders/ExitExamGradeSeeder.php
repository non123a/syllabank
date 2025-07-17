<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ExitExamGradeSeeder extends Seeder
{
    public function run(): void
    {
        $grade = \Domain\Class\Models\ExitExamGrade::make([
            "value" => 90,
        ]);

        $grade->student()->associate(2);
        $grade->semester()->associate(1);
        $grade->save();
    }
}
