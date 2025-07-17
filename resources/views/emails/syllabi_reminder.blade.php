<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reminder: Upcoming Syllabi Submissions</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f0f4f8;
            color: #333;
            padding: 50px;
            line-height: 1.6;
        }

        .container {
            max-width: 700px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        h1 {
            font-size: 28px;
            margin-bottom: 25px;
            color: #2c3e50;
            text-align: center;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }

        .form-header {
            display: flex;
            justify-content: left;
            align-items: baseline;
            margin-bottom: 30px;
        }

        .form-header-text {
            font-size: 24px;
            color: #2c3e50;
        }

        .form-logo {
            font-weight: bold;
            color: #00ff00;
        }

        p {
            margin-bottom: 15px;
        }

        ul {
            padding-left: 20px;
        }

        li {
            margin-bottom: 10px;
        }

        .signature {
            margin-top: 30px;
            border-top: 1px solid #e0e0e0;
            padding-top: 15px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="form-header">
            <div class="form-header-text">
                Sylla<span class="form-logo">Bank</span>
            </div>
        </div>
        <h1>Reminder: Upcoming Syllabi Submissions</h1>
        <p>Dear Instructor,</p>
        <p>This is a reminder that you have upcoming syllabi submissions for the following semesters:</p>
        <ul>
            @foreach ($upcomingSemesters as $semester)
                <li>{{ $semester->name }} (Starts on {{ $semester->start_date->format('Y-m-d') }})</li>
            @endforeach
        </ul>
        <p>Please ensure that you submit your syllabi before the semester start date.</p>
        <p>Thank you for your attention to this matter.</p>
        <div class="signature">
            <p>Best regards,<br>Administrators</p>
        </div>
    </div>
</body>

</html>
