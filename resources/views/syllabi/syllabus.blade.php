<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $courseCode ?? '[Course Code]' }} Syllabus</title>
    <style>
        @page {
            margin: 100px 25px 80px 25px;
        }

        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }

        .header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 100px;
            padding: 10px 25px;
        }

        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 50px;
            padding: 10px 25px;
            text-align: left;
            font-size: 0.9em;
            color: #666;
            border-top: 0.4pt solid #666;
        }

        .content {
            margin-top: 120px;
            margin-bottom: 70px;
            padding: 0 25px;
        }

        .logo-container {
            float: left;
            width: 30%;
        }

        .logo {
            max-width: 100%;
            height: auto;
        }

        .course-info {
            float: right;
            width: 70%;
            text-align: right;
            color: #1F1F7C;
        }

        .course-info p {
            margin: 0;
            line-height: 1.4;
            font-weight: bold;
        }

        .header-divider {
            clear: both;
            border-top: 2px solid #1F1F7C;
            margin-top: 10px;
        }

        .section-title {
            color: #1F1F7C;
            font-size: 1.5em;
            font-weight: bold;
            margin-top: 30px;
            margin-bottom: 15px;
            border-bottom: 1px solid #1F1F7C;
            padding-bottom: 5px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th,
        td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: left;
        }

        th {
            background-color: #f0f0f0;
            color: #1F1F7C;
        }

        ul {
            padding-left: 20px;
        }

        .footer {
            text-align: left;
            font-size: 0.9em;
            color: #666;
            padding: 10px 20px;
            background-color: rgba(255, 255, 255, 0.9);
            position: sticky;
            bottom: 0;
            left: 0;
            width: 100%;
            box-sizing: border-box;
        }

        .header-divider {
            border-top: 2px solid #1F1F7C;
            margin-bottom: 20px;
        }

        @media print {
            @page: not(:first) {
                .header {
                    display: none;
                }
            }
        }
    </style>
</head>

<body>
    <div class="header">
        <div class="logo-container">
            <img src="{{ $logoSrc ?? 'path/to/default/logo.png' }}" alt="University Logo" class="logo">
        </div>
        <div class="course-info">
            <p><strong>{{ $courseCode ?? '[Course Code]' }}</strong></p>
            <p><strong>Academic Year {{ $academicYear ?? '20XX/20XX' }}</strong></p>
            <p><strong>{{ $semester ?? 'Semester X' }}</strong></p>
            <p><strong>Credits: {{ $credits ?? 'X' }}</strong></p>
        </div>
        <div class="header-divider"></div>
    </div>

    <div class="content">
        <div class="instructor-info">
            <h2 class="section-title">Instructor Information</h2>
            <table>
                <tr>
                    <td><strong>Name</strong></td>
                    <td>{{ $instructorName ?? '[Include your title and what you prefer to be called]' }}</td>
                </tr>
                <tr>
                    <td><strong>Contact Info</strong></td>
                    <td>{{ $instructorContact ?? '[Include information for your preferred method of contact here and office #]' }}
                    </td>
                </tr>
                <tr>
                    <td><strong>Office hours</strong></td>
                    <td>{{ $officeHours ?? '[Write by appointment if you don\'t have scheduled office hours]' }}</td>
                </tr>
            </table>

            @if (isset($taName) && isset($taContact))
                <h2 class="section-title">T.A. Information</h2>
                <table>
                    <tr>
                        <td><strong>TA Name</strong></td>
                        <td>{{ $taName }}</td>
                    </tr>
                    <tr>
                        <td><strong>TA Contact Info</strong></td>
                        <td>{{ $taContact }}</td>
                    </tr>
                </table>
            @endif
        </div>

        <div class="section-title">Course Description</div>
        <p>{{ $courseDescription ?? 'From course information (if it is provided by Head of Department or Program Coordinator)' }}
        </p>

        <div class="section-title">Course Objectives</div>
        <p>Objectives describe the goals and intentions of the professor who teaches the course. They are often termed
            the input in the course and may describe what the staff and faculty will do. 3 to 8 objectives can be listed
            here.</p>
        <ul>
            @foreach ($courseObjectives ?? [] as $objective)
                <li>{{ $objective }}</li>
            @endforeach
        </ul>

        <div class="section-title">Learning Outcomes</div>
        <p>What, specifically, will students be able to do or demonstrate once they've completed the course? Identify
            3-8 course-level learning outcomes for the course syllabus.</p>
        <ul>
            @foreach ($learningOutcomes ?? [] as $outcome)
                <li>{{ $outcome }}</li>
            @endforeach
        </ul>

        <div class="section-title">Learning Resources</div>
        <p>{{ $learningResources ?? 'What materials are required for your course, including those indicated in Course Information (e.g., textbooks, software, lab equipment, etc.)?' }}
        </p>

        <div class="section-title">Assessment</div>
        <p>Assessment measures Learning Outcomes. Assessment ensures that knowledge and skills that students acquire in
            the course match the Learning Outcomes. Thus, all the assessment tools that you use (projects, exams,
            quizzes, homework, class discussions, etc.) should evaluate whether and to what extent students are able to
            demonstrate attainment of the knowledge and skills in play.</p>
        <p>Below is a sample of the usual assessments implemented in a course. The instructor may change it accordingly
            to their needs; however, attendance is a compulsory part of grading and comprises 10% of the course grade
            (please see Paragon.U's attendance policy on page 15-17 of the Student Handbook). Exceptions to this rule
            can be requested from the relevant Head of Department.</p>
        <table>
            <tr>
                <th>Assessment</th>
                <th>Percentage of Final Grade</th>
            </tr>
            <tr>
                <td>Attendance</td>
                <td>10%</td>
            </tr>
            @foreach ($assessments ?? [] as $assessment => $percentage)
                <tr>
                    <td>{{ $assessment }}</td>
                    <td>{{ $percentage }}</td>
                </tr>
            @endforeach
        </table>
        <p>Indicate here all the relevant information related to assessment, so students have a clear idea of how they
            will be graded. For Project/Portfolio/Essay type assessments, provide grading rubric here or in a separate
            file.</p>

        <div class="section-title">Course Policies</div>
        <ul>
            <li><strong>Attendance & Participation:</strong> {{ $attendancePolicy ?? 'Attendance policy goes here.' }}
            </li>
            <li><strong>Academic Integrity & Collaboration:</strong>
                {{ $academicIntegrityPolicy ?? 'Academic integrity policy goes here.' }}</li>
            @foreach ($additionalPolicies ?? [] as $policy => $description)
                <li><strong>{{ $policy }}:</strong> {{ $description }}</li>
            @endforeach
        </ul>

        <div class="section-title">Course Schedule</div>
        <table>
            <tr>
                <th>Weeks</th>
                <th>Theme/Topic</th>
                <th>Contents</th>
                <th>Assignments/Reading</th>
            </tr>
            @foreach ($courseSchedule ?? [] as $week => $details)
                <tr>
                    <td>{{ $week }}</td>
                    <td>{{ $details['theme'] ?? '' }}</td>
                    <td>{{ $details['contents'] ?? '' }}</td>
                    <td>{{ $details['assignments'] ?? '' }}</td>
                </tr>
            @endforeach
        </table>

        @if (isset($notes))
            <div class="section-title">Notes</div>
            <p>{{ $notes }}</p>
        @endif
    </div>

    <div class="footer">
        <p>Paragon International University</p>
    </div>
</body>

</html>
