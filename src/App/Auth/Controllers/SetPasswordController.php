<?php

namespace App\Auth\Controllers;

use App\Http\Controllers\Controller;
use Domain\Auth\Actions\SetPassword;
use Domain\Auth\DataTransferObjects\SetPasswordData;

class SetPasswordController extends Controller
{
    public function update(SetPasswordData $setPasswordData, SetPassword $setPassword)
    {
        $status = $setPassword->execute($setPasswordData);

        return response()->json(['data' => [], 'message' => __($status)]);
    }
}
