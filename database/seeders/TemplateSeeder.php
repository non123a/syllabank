<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Domain\Syllabus\Models\SyllabusTemplate;
use Illuminate\Support\Facades\Storage;

class TemplateSeeder extends Seeder
{
    public function run()
    {
        $jsonContent = [
            'head' => [
                'title' => '[Course Code] Syllabus',
                'styles' => '/* Styles will be populated by getStyles() method */',
            ],
            'body' => [
                'header' => [
                    'logo' => [
                        'src' => '/images/logo.png',
                        'alt' => 'Paragon International University Logo',
                    ],
                    'courseInfo' => [
                        'courseCode' => '[Course Code]',
                        'academicYear' => '20XX/20XX',
                        'semester' => 'Semester X',
                        'credits' => 'Credits: X',
                    ],
                ],
                'content' => [
                    'instructorInfo' => [
                        'title' => 'Instructor Information',
                        'table' => [
                            'headers' => ['Name', 'Contact Info', 'Office hours'],
                            'rows' => [
                                ['[Include your title and what you prefer to be called]', '[Include information for your preferred method of contact here and office #]', '[Write by appointment if you don\'t have scheduled office hours]'],
                            ],
                        ],
                    ],
                    'taInfo' => [
                        'title' => 'T.A. Information',
                        'table' => [
                            'headers' => ['TA NAME', 'TA CONTACT INFO'],
                            'rows' => [
                                ['[TA Name]', '[TA Contact Info]'],
                            ],
                        ],
                    ],
                    'courseDescription' => [
                        'title' => 'Course Description',
                        'description' => 'From course information (if it is provided by Head of Department or Program Coordinator)',
                    ],
                    'courseObjectives' => [
                        'title' => 'Course Objectives',
                        'description' => 'Objechugi9u567890 describe the goals and intentions of the professor who teaches the course. They are often termed the input in the course and may describe what the staff and faculty will do. 3 to 8 objectives can be listed here.',
                    ],
                    'learningOutcomes' => [
                        'title' => 'Learning Outcomes',
                        'description' => 'What, specifically, will students be able to do or demonstrate once they\'ve completed the course? Identify 3-8 course-level learning outcomes for the course syllabus.',
                    ],
                    'learningResources' => [
                        'title' => 'Learning Resources',
                        'description' => 'What materials are required for your course, including those indicated in Course Information (e.g., textbooks, software, lab equipment, etc.)?',
                    ],
                    'assessment' => [
                        'title' => 'Assessment',
                        'description' => 'Assessment measures Learning Outcomes. Assessment ensures that knowledge and skills that students acquire in the course match the Learning Outcomes. Thus, all the assessment tools that you use (projects, exams, quizzes, homework, class discussions, etc.) should evaluate whether and to what extent students are able to demonstrate attainment of the knowledge and skills in play.',
                        'table' => [
                            'headers' => ['Assessment', 'Percentage of Final Grade'],
                            'rows' => [
                                ['Attendance', '10%'],
                                ['[Assessment 1]', '[Percentage 1]'],
                                ['[Assessment 2]', '[Percentage 2]'],
                            ],
                        ],
                    ],
                    'coursePolicies' => [
                        'title' => 'Course Policies',
                        'description' => 'Indicate here all the relevant information related to assessment, so students have a clear idea of how they will be graded. For Project/Portfolio/Essay type assessments, provide grading rubric here or in a separate file.',
                    ],
                    'courseSchedule' => [
                        'title' => 'Course Schedule',
                        'table' => [
                            'headers' => ['Weeks', 'Theme/Topic', 'Contents', 'Assignments/Reading'],
                            'rows' => [
                                ['Week 11', '[Theme 1]', '[Contents 1]', '[Assignments 1]'],
                                ['Week 2', '[Theme 2]', '[Contents 2]', '[Assignments 2]'],
                            ],
                        ],
                        'notes' => [
                            'title' => 'Notes',
                            'description' => '[Additional notes if any]',
                        ],
                    ],
                ],
                'footer' => [
                    'content' => 'Paragon International University',
                ],
            ],
        ];

        SyllabusTemplate::create([
            'name' => 'Default Template',
            'description' => 'Default syllabus template for Paragon International University',
            'content' => json_encode($jsonContent),
            'is_active' => true,
        ]);
    }

    private function getStyles()
    {
        return [
            '@page' => [
                'margin' => '100px 25px 80px 25px',
            ],
            'body' => [
                'font-family' => 'Arial, sans-serif',
                'line-height' => '1.6',
                'color' => '#333',
                'margin' => '0',
                'padding' => '0',
            ],
            '.header' => [
                'position' => 'fixed',
                'top' => '0',
                'left' => '0',
                'right' => '0',
                'height' => '100px',
                'padding' => '10px 25px',
            ],
            '.footer' => [
                'position' => 'fixed',
                'bottom' => '0',
                'left' => '0',
                'right' => '0',
                'height' => '50px',
                'padding' => '10px 25px',
                'text-align' => 'left',
                'font-size' => '0.9em',
                'color' => '#666',
                'border-top' => '0.4pt solid #666',
            ],
            '.content' => [
                'margin-top' => '120px',
                'margin-bottom' => '70px',
                'padding' => '0 25px',
            ],
            '.logo-container' => [
                'float' => 'left',
                'width' => '30%',
            ],
            '.logo' => [
                'max-width' => '100%',
                'height' => 'auto',
            ],
            '.course-info' => [
                'float' => 'right',
                'width' => '70%',
                'text-align' => 'right',
                'color' => '#1F1F7C',
            ],
            '.course-info p' => [
                'margin' => '0',
                'line-height' => '1.4',
                'font-weight' => 'bold',
            ],
            '.header-divider' => [
                'clear' => 'both',
                'border-top' => '2px solid #1F1F7C',
                'margin-top' => '10px',
            ],
            '.section-title' => [
                'color' => '#1F1F7C',
                'font-size' => '1.5em',
                'font-weight' => 'bold',
                'margin-top' => '30px',
                'margin-bottom' => '15px',
                'border-bottom' => '1px solid #1F1F7C',
                'padding-bottom' => '5px',
            ],
            'table' => [
                'width' => '100%',
                'border-collapse' => 'collapse',
                'margin-bottom' => '20px',
            ],
            'th, td' => [
                'border' => '1px solid #ccc',
                'padding' => '10px',
                'text-align' => 'left',
            ],
            'th' => [
                'background-color' => '#f0f0f0',
                'color' => '#1F1F7C',
            ],
            'ul' => [
                'padding-left' => '20px',
            ],
            '@media print' => [
                '@page:not(:first)' => [
                    '.header' => [
                        'display' => 'none',
                    ],
                ],
            ],
        ];
    }
}
