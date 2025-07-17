<?php

namespace Database\Seeders;

use Domain\User\Enums\EnglishLevels;
use Illuminate\Database\Seeder;

class ClassSeeder extends Seeder
{
    public function run(): void
    {
        $classes = [
            [
                'class_name' => 'Class 1',
                'type' => 'regular',
                'metadata' => [
                    "english_level" => EnglishLevels::STARTER_LEVEL
                ]
            ],
            [
                'class_name' => 'Class 2',
                'type' => 'regular',
                'metadata' => [
                    "english_level" => EnglishLevels::LEVEL_1
                ]
            ],
            [
                'class_name' => 'Class 3',
                'type' => 'summer',
                'metadata' => [
                    "english_level" => EnglishLevels::LEVEL_2
                ]
            ]

        ];

        foreach ($classes as $class) {
            $class = \Domain\Class\Models\_Class::make($class);
            if ($class->type === 'regular')
                $class->semester()->associate(2)->save();
            else if ($class->type === 'summer')
                $class->semester()->associate(1)->save();
        }
    }
}
