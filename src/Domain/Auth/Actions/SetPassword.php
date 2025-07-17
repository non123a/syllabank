<?php

namespace Domain\Auth\Actions;

use Domain\Auth\DataTransferObjects\SetPasswordData;
use Domain\Auth\Events\PasswordChanged;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class SetPassword
{
    public function execute(SetPasswordData $setPasswordData)
    {
        $status = Password::reset([
            'email' => $setPasswordData->email,
            'password' => $setPasswordData->newPassword,
            'token' => $setPasswordData->token
        ],  function ($user, $password) {

            $user->forceFill([
                'password' => Hash::make($password)
            ])
                ->setRememberToken(Str::random(60));

            $user->save();

            event(new PasswordChanged($user));
        });

        if ($status != Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                __($status),
            ]);
        }

        $status = 'passwords.set';

        return $status;
    }
}
