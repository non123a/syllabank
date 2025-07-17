<!DOCTYPE html>
<html>

<head>
    <title>Account Credentials</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            color: #333;
            text-align: 'flex-start';
            padding: 50px;
        }

        h1 {
            font-size: 36px;
            margin-bottom: 30px;
        }

        p {
            font-size: 18px;
            line-height: 1.5;
            margin-bottom: 20px;
        }

        strong {
            color: #ff6347;
        }
    </style>
</head>

<body>
    <h1>Welcome, {{ $name }}!</h1>
    <p>You have been registered as {{ $user->roles->map(fn($role) => $role->name)->join(', ', ' and ') }}.</p>
    <p>Your department is {{ $user->department->code_name }} {{ $user->department->full_name }}, under
        {{ $user->department->faculty->code_name }} faculty.
    </p>
    <p>Here is your generated password: <strong>{{ $password }}</strong></p>
    <p>Please change this password as soon as you log in for the first time.</p>
    <p>Thank you!</p>
    <p>Please go to <a href="{{ env('FRONTEND_URL') }}">{{ env('FRONTEND_URL') }}</a> to log in and
        change your password</p>
</body>

</html>
