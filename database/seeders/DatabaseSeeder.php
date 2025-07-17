<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RbacSeeder::class);
        $this->call(FacultyDepartmentSeeder::class);
        $this->call(AcademicPeriodSeeder::class);
        $this->call(SemesterSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(CourseSeeder::class);
        $this->call(TemplateSeeder::class);
        // $this->call(CourseAssignmentSeeder::class);
        // $this->call(SyllabusSeeder::class);
    }
}
