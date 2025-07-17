<?php

namespace Domain\Auth\Actions;

use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class EnsureIsNotRateLimited
{
    public function execute(string $throttleKey)
    {
        if (!RateLimiter::tooManyAttempts($throttleKey, 5)) {
            return;
        }

        $seconds = RateLimiter::availableIn($throttleKey);

        throw ValidationException::withMessages([
            'phone' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }
}
