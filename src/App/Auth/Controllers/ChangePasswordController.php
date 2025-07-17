<?php

namespace App\Auth\Controllers;

use App\Http\Controllers\Controller;
use Domain\Auth\Actions\ChangePassword;
use Domain\Auth\DataTransferObjects\ChangePasswordData;

class ChangePasswordController extends Controller
{
    public function update(ChangePasswordData $changePasswordData, ChangePassword $changePassword)
    {
        $status = $changePassword->execute($changePasswordData);

        return response()->json(['message' => __($status)]);
    }
}
