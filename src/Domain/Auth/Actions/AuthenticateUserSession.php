<?php

namespace Domain\Auth\Actions;

use Domain\Auth\DataTransferObjects\SigninData;

class AuthenticateUserSession
{
    public function __construct(
        private GenerateThrottleKey $generateThrottleKey,
        private EnsureIsNotRateLimited $ensureIsNotRateLimited,
        private AttemptSignIn $attemptSignIn,
        private RegenerateAuthSession $regenerateAuthSession,
    ) {
    }

    public function execute(SigninData $signinData)
    {
        $throttleKey = $this->generateThrottleKey->execute($signinData);

        $this->ensureIsNotRateLimited->execute($throttleKey);

        $this->attemptSignIn->execute($signinData, $throttleKey);

        $this->regenerateAuthSession->execute();
    }
}
