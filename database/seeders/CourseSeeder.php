<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Domain\Course\Models\Course;
use Domain\AcademicPeriod\Models\Semester;
use Domain\School\Models\Department;
use Domain\AcademicPeriod\Models\AcademicYear;
use Domain\AcademicPeriod\Models\Semesters;

class CourseSeeder extends Seeder
{
    public function run(): void
    {

        $courses = [
            // CS Department
            ['course_subject' => 'CS', 'course_code' => '101', 'course_name' => 'Introduction to Computer Science', 'description' => 'Fundamental concepts of programming and computer science.', 'department' => 'CS'],
            ['course_subject' => 'CS', 'course_code' => '250', 'course_name' => 'Data Structures and Algorithms', 'description' => 'Fundamental data structures and algorithms used in computer programming.', 'department' => 'CS'],
            ['course_subject' => 'CS', 'course_code' => '300', 'course_name' => 'Database Systems', 'description' => 'Design and implementation of database management systems.', 'department' => 'CS'],

            // MIS Department
            ['course_subject' => 'MIS', 'course_code' => '200', 'course_name' => 'Business Information Systems', 'description' => 'Introduction to information systems in business environments.', 'department' => 'MIS'],
            ['course_subject' => 'MIS', 'course_code' => '310', 'course_name' => 'Systems Analysis and Design', 'description' => 'Methodologies for analyzing and designing information systems.', 'department' => 'MIS'],
            ['course_subject' => 'MIS', 'course_code' => '400', 'course_name' => 'IT Project Management', 'description' => 'Principles and practices of managing IT projects.', 'department' => 'MIS'],

            // CE Department
            ['course_subject' => 'CE', 'course_code' => '150', 'course_name' => 'Introduction to Computer Engineering', 'description' => 'Fundamentals of computer hardware and software systems.', 'department' => 'CE'],
            ['course_subject' => 'CE', 'course_code' => '250', 'course_name' => 'Digital Logic Design', 'description' => 'Design of digital circuits and systems.', 'department' => 'CE'],
            ['course_subject' => 'CE', 'course_code' => '350', 'course_name' => 'Computer Architecture', 'description' => 'Organization and design of computer systems.', 'department' => 'CE'],

            // ARC Department
            ['course_subject' => 'ARC', 'course_code' => '101', 'course_name' => 'Introduction to Architecture', 'description' => 'Basic principles and concepts of architectural design.', 'department' => 'ARC'],
            ['course_subject' => 'ARC', 'course_code' => '210', 'course_name' => 'Architectural Design Studio I', 'description' => 'Fundamental design skills and techniques in architecture.', 'department' => 'ARC'],
            ['course_subject' => 'ARC', 'course_code' => '320', 'course_name' => 'Building Materials and Construction', 'description' => 'Properties of building materials and construction methods.', 'department' => 'ARC'],

            // IE Department
            ['course_subject' => 'IE', 'course_code' => '200', 'course_name' => 'Introduction to Industrial Engineering', 'description' => 'Overview of industrial engineering principles and practices.', 'department' => 'IE'],
            ['course_subject' => 'IE', 'course_code' => '300', 'course_name' => 'Operations Research', 'description' => 'Mathematical modeling and optimization techniques for decision-making.', 'department' => 'IE'],
            ['course_subject' => 'IE', 'course_code' => '400', 'course_name' => 'Production Planning and Control', 'description' => 'Techniques for planning and controlling production systems.', 'department' => 'IE'],
        ];

        foreach ($courses as $course) {
            Course::create([
                'course_subject' => $course['course_subject'],
                'course_code' => $course['course_code'],
                'course_name' => $course['course_name'],
                'description' => $course['description'],
                'is_active' => true,
                'author_id' => 5,
            ]);
        }
    }
}
