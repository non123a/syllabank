<?php

namespace App\Auth\Controllers;

use App\Http\Controllers\Controller;
use Domain\Auth\Actions\SendPasswordResetLink;
use Domain\Auth\DataTransferObjects\SendPasswordResetLinkData;


class PasswordResetLinkController extends Controller
{
    public function store(SendPasswordResetLinkData $sendPasswordResetLinkData, SendPasswordResetLink $sendPasswordResetLink)
    {
        $status = $sendPasswordResetLink->execute($sendPasswordResetLinkData);

        return response()->json(['status' => __($status)]);
    }
}
