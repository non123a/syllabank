<?php

namespace Domain\Auth\Actions;

use Domain\Auth\DataTransferObjects\ResetPasswordData;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ResetPassword
{
    public function execute(ResetPasswordData $resetPasswordData)
    {
        $status = Password::reset(
            [
                'email' => $resetPasswordData->email,
                'password' => $resetPasswordData->password,
                'password_confirmation' => $resetPasswordData->confirmPassword,
                'token' => $resetPasswordData->token
            ],
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        if ($status != Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return $status;
    }
}
