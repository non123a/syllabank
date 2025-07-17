<?php

namespace Database\Seeders;

use Domain\AcademicPeriod\Models\AcademicYear;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Date;

class AcademicPeriodSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        for ($year = 2020; $year <= 2024; $year++) {
            AcademicYear::create([
                'start_date' => Date::parse($year . '-01-01')->startOfYear(),
                'end_date' => Date::parse(($year + 1) . '-12-31')->endOfYear(),
                'is_active' => ($year == 2024),
            ]);
        }

        // $academicYear
        //     ->semesters()
        //     ->createMany(
        //         [
        //             [
        //                 'semester_number' => 1,
        //                 'start_date' => Date::parse('2023-01-01'),
        //                 'end_date' => Date::parse('2023-06-30'),
        //             ],
        //             [
        //                 'semester_number' => 2,
        //                 'start_date' => Date::parse('2023-07-01'),
        //                 'end_date' => Date::parse('2023-09-30'),
        //             ],
        //             [
        //                 'semester_number' => 3,
        //                 'start_date' => Date::parse('2024-01-01'),
        //                 'end_date' => Date::parse('2024-06-30')
        //             ]
        //         ]
        //     );
    }
}
