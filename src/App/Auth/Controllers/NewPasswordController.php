<?php

namespace App\Auth\Controllers;

use App\Http\Controllers\Controller;
use Domain\Auth\Actions\ResetPassword;
use Domain\Auth\DataTransferObjects\ResetPasswordData;

class NewPasswordController extends Controller
{
    public function store(ResetPasswordData $resetPasswordData, ResetPassword $resetPassword)
    {
        $status = $resetPassword->execute($resetPasswordData);

        return response()->json(['status' => __($status)]);
    }
}
