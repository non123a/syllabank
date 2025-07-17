<?php

namespace Domain\Auth\Actions;

use Domain\Auth\DataTransferObjects\SignInData;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AttemptSignIn
{
    public function execute(SignInData $signinData, string $throttleKey)
    {
        if (!Auth::attempt(['email' => $signinData->email, 'password' => $signinData->password], $signinData->rememberMe)) {
            RateLimiter::hit($throttleKey);

            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        RateLimiter::clear($throttleKey);
    }
}
