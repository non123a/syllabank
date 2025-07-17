<?php

namespace Domain\Auth\DataTransferObjects;

use Spatie\LaravelData\Data;

class SendPasswordResetLinkData extends Data
{
    public function __construct(public string $email)
    {
    }
}
