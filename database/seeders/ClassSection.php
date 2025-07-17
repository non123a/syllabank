<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ClassSection extends Seeder
{
    public function run(): void
    {
        $classSections = [
            [
                'section_number' => '1',
                'passing_grade' => '75'
            ],
            [
                'section_number' => '2',
                'passing_grade' => '75'
            ],
            [
                'section_number' => '3',
                'passing_grade' => '75'
            ],
            [
                'section_number' => '4',
                'passing_grade' => '75'
            ]
        ];

        foreach ($classSections as $index => $section) {
            $section = \Domain\Class\Models\Section::make($section);

            $section->class()->associate(1);

            $section->instructor()->associate(1);

            $section->save();

            $section->refresh();

            if ($index === 0) {

                \Domain\Class\Models\Schedule::make([
                    'day' => 1,
                    'start_time' => '08:00:00',
                    'end_time' => '10:00:00',
                ])->section()->associate($section)->save();


                \Domain\Class\Models\Schedule::make([
                    'day' => 3,
                    'start_time' => '08:00:00',
                    'end_time' => '10:00:00'
                ])->section()->associate($section)->save();

                \Domain\Class\Models\Schedule::make([
                    'day' => 5,
                    'start_time' => '08:00:00',
                    'end_time' => '10:00:00'
                ])->section()->associate($section)->save();

            }
        }
    }
}
