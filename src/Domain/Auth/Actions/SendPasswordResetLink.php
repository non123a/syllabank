<?php

namespace Domain\Auth\Actions;

use Domain\Auth\DataTransferObjects\SendPasswordResetLinkData;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class SendPasswordResetLink
{
    public function execute(SendPasswordResetLinkData $sendPasswordResetLinkData)
    {
        $status = Password::sendResetLink([
            'email' => $sendPasswordResetLinkData->email
        ]);

        if ($status != Password::RESET_LINK_SENT) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return $status;
    }
}
