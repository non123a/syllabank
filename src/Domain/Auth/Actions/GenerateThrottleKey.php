<?php

namespace Domain\Auth\Actions;

use Domain\Auth\DataTransferObjects\SigninData;
use Illuminate\Support\Str;

class GenerateThrottleKey
{
    public function execute(SigninData $signinData)
    {
        return Str::lower($signinData->email . '|' . $signinData->ip);
    }
}
