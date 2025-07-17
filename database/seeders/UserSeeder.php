<?php

namespace Database\Seeders;

use Domain\Course\Models\Course;
use Domain\User\Enums\EnglishLevels;
use Domain\User\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Domain\AcademicPeriod\Models\AcademicYear;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create the super-admin user
        User::factory()
            ->create([
                'identification_number' => '200204421',
                'name' => 'Super Admin',
                'email' => 'admin@paragoniu.edu.kh',
                'password' => Hash::make('password'),
            ])
            ->assignRole('super-admin');

        // Create the instructor users
        $instructors = [
            ['name' => 'Test Instructor', 'email' => 'instructor@paragoniu.edu.kh'],
            ['name' => 'John Doe', 'email' => 'john.doe@paragoniu.edu.kh'],
            ['name' => 'Jane Smith', 'email' => 'jane.smith@paragoniu.edu.kh'],
            ['name' => 'Michael Johnson', 'email' => 'michael.johnson@paragoniu.edu.kh'],
            ['name' => 'Emily Brown', 'email' => 'emily.brown@paragoniu.edu.kh'],
            ['name' => 'David Wilson', 'email' => 'david.wilson@paragoniu.edu.kh'],
            ['name' => 'Sarah Davis', 'email' => 'sarah.davis@paragoniu.edu.kh'],
            ['name' => 'Robert Taylor', 'email' => 'robert.taylor@paragoniu.edu.kh'],
            ['name' => 'Jennifer Anderson', 'email' => 'jennifer.anderson@paragoniu.edu.kh'],
            ['name' => 'William Thomas', 'email' => 'william.thomas@paragoniu.edu.kh'],
            ['name' => 'Lisa Martinez', 'email' => 'lisa.martinez@paragoniu.edu.kh']
        ];

        foreach ($instructors as $index => $instructor) {
            $identificationNumber = '302' . str_pad($index + 1, 3, '0', STR_PAD_LEFT);

            // Check if a user with this identification number already exists
            if (!User::where('identification_number', $identificationNumber)->exists()) {
                User::factory()
                    ->create([
                        'identification_number' => $identificationNumber,
                        'name' => $instructor['name'],
                        'email' => $instructor['email'],
                        'password' => Hash::make('password'),
                        'metadata' => [],
                        'department_id' => 1,
                    ])
                    ->assignRole('instructor');
            }
        }

        // Create the student user
        User::factory()
            ->create([
                'identification_number' => '20020326',
                'name' => 'Test Student',
                'email' => 'student@paragoniu.edu.kh',
                'password' => Hash::make('password'),
                'metadata' => [
                    'balls' => "yo jaw bruh",
                ],
                'department_id' => 1,
            ])
            ->assignRole('student');

        User::factory()
            ->create(
                [
                    'identification_number' => '20020321',
                    'name' => 'Test Provost',
                    'email' => 'provost@paragoniu.edu.kh',
                    'password' => Hash::make('password'),
                    'department_id' => 1,
                ]
            )->assignRole('provost');

        User::factory()->create(
            [
                'identification_number' => '20020323',
                'name' => 'Test Dean',
                'email' => 'dean@paragoniu.edu.kh',
                'password' => Hash::make('password'),
                'department_id' => 1,
            ]
        )->assignRole('dean');

        User::factory()
            ->create(
                [
                    'identification_number' => '20020322',
                    'name' => 'Test Head of Department',
                    'email' => 'hod@paragoniu.edu.kh',
                    'password' => Hash::make('password'),
                    'department_id' => 1
                ]
            )->assignRole('hod');
    }
}
