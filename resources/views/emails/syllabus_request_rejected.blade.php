<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rejected Request Form</title>
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
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        h1 {
            font-size: 28px;
            margin-bottom: 25px;
            color: #2c3e50;
            text-align: center;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        .form-group {
            margin-bottom: 25px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #34495e;
        }
        input[type="text"], input[type="email"], textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #bdc3c7;
            border-radius: 4px;
            font-size: 16px;
            transition: border-color 0.3s ease;
        }
        input[type="text"]:focus, input[type="email"]:focus, textarea:focus {
            border-color: #3498db;
            outline: none;
        }
        textarea {
            height: 120px;
            resize: vertical;
        }
        .approval-status {
            font-size: 18px;
            font-weight: bold;
            color: #27ae60;
            margin-bottom: 25px;
            text-align: center;
            padding: 10px;
            background-color: #e8f8f5;
            border-radius: 4px;
        }
        .form-header {
            display: flex;
            justify-content: left;
            align-items: baseline;
            margin-bottom: 30px;
        }
        .form-header text {
            font-size: 24px;
            color: #2c3e50;
        }
        .form-logo {
            font-weight: bold;
            color: #00ff00;
        }
        .form-number {
            font-size: 18px;
            color: #7f8c8d;
        }
        input[readonly], textarea[readonly] {
            background-color: #f8f9fa;
            cursor: not-allowed;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="form-header">
            <div class="form-header text">
                Sylla
                <span class="form-logo">Bank</span>
            </div>
        </div>
        <h1>Rejected Request Form</h1>
        <div class="approval-status">Status: Rejected</div>
        <form>
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" value="{{ $name }}" readonly>
            </div>
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" value="{{ $email }}" readonly>
            </div>
            <div class="form-group">
                <label for="description">Request Description:</label>
                <textarea id="description" name="description" readonly>{{ $description }}</textarea>
            </div>
            <div class="form-group">
                <label for="feedback">Request Feedback:</label>
                <textarea id="feedback" name="feedback" readonly>{{ $feedback }}</textarea>
            </div>
            <div class="form-group">
                <label for="approved_by">Approved By:</label>
                <input type="text" id="approved_by" name="approved_by" value="{{ $approved_by }}" readonly>
            </div>
            <div class="form-group">
                <label for="approval_date">Approval Date:</label>
                <input type="text" id="approval_date" name="approval_date" value="{{ $approval_date }}" readonly>
            </div>
        </form>
    </div>
</body>
</html>
