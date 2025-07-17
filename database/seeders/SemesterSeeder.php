<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Domain\AcademicPeriod\Models\Semester;
use Carbon\Carbon;
use Domain\AcademicPeriod\Models\AcademicYear;
use Domain\AcademicPeriod\Models\Semesters;

class SemesterSeeder extends Seeder
{
    public function run(): void
    {
        $academicYears = AcademicYear::all();

        foreach ($academicYears as $academicYear) {
            $startDate = Carbon::parse($academicYear->start_date);
            $endDate = Carbon::parse($academicYear->end_date);

            Semester::create([
                'semester_number' => 1,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'academic_year_id' => $academicYear->id,
            ]);

            Semester::create([
                'semester_number' => 2,
                'start_date' => $startDate->addMonths(6),
                'end_date' => $endDate->addMonths(6),
                'academic_year_id' => $academicYear->id,
            ]);
        }
    }
}
