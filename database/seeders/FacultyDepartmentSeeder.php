<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FacultyDepartmentSeeder extends Seeder
{
    public function run()
    {
        $faculties = [
            'CPE' => ['full_name' => 'Center for Professional Education', 'departments' => [
                'CPE' => 'Center for Professional Education',
                'STAFF' => 'Center for Professional Education Staff'
            ]],
            'ENGR' => ['full_name' => 'Engineering', 'departments' => [
                'AE' => 'Department of Architectural Engineering',
                'ARC' => 'Department of Architecture',
                'CE' => 'Department of Civil Engineering',
                'CM' => 'Department of Construction Management',
                'IE' => 'Department of Industrial Engineering',
                'STAFF' => 'Engineering Staff'
            ]],
            'EAS' => ['full_name' => 'Economics and Administrative Sciences', 'departments' => [
                'BAF' => 'Department of Banking and Finance',
                'BUS' => 'Department of Business Administration',
                'ECON' => 'Department of Economics',
                'IR' => 'Department of International Relations',
                'ITL' => 'Department of International Trade and Logistics',
                'STAFF' => 'Economics and Administrative Sciences Staff'
            ]],
            'ICT' => ['full_name' => 'Information and Communication Technology', 'departments' => [
                'CS' => 'Department of Computer Science',
                'DAD' => 'Department of Digital Arts and Design',
                'MIS' => 'Department of Management of Information Systems',
                'STAFF' => 'ICT Staff'
            ]],
            'AHL' => ['full_name' => 'Arts, Humanities and Languages', 'departments' => [
                'ELT' => 'Department of English Language Teaching',
                'DL' => 'Department of Languages',
                'STAFF' => 'Arts, Humanities and Languages Staff'
            ]],
            'MSF' => ['full_name' => 'Mathematics, Science and Fundamentals', 'departments' => [
                'DM' => 'Department of Mathematics',
                'STAFF' => 'Mathematics, Science and Fundamentals Staff'
            ]],
            'EPS' => ['full_name' => 'English Preparatory School', 'departments' => [
                'ELPP' => 'English Language Preparatory Program',
                'STAFF' => 'English Preparatory School Staff'
            ]],
            'IFCC' => ['full_name' => 'International Foundation and Concurrent Certificate', 'departments' => [
                'IFD' => 'International Foundation Diploma',
                'STAFF' => 'International Foundation and Concurrent Certificate Staff'
            ]],
            'FYP' => ['full_name' => 'Foundation Year Program', 'departments' => [
                'FYP' => 'Foundation Year Program',
                'STAFF' => 'Foundation Year Program Staff'
            ]]
        ];

        foreach ($faculties as $facultyCode => $facultyInfo) {
            $facultyId = DB::table('faculties')->insertGetId([
                'code_name' => $facultyCode,
                'full_name' => $facultyInfo['full_name'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($facultyInfo['departments'] as $departmentCode => $departmentName) {
                DB::table('departments')->insert([
                    'code_name' => $departmentCode,
                    'full_name' => $departmentName,
                    'faculty_id' => $facultyId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}