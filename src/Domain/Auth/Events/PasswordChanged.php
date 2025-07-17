<?php

namespace Domain\Auth\Events;

use Domain\User\Models\User;
use Illuminate\Queue\SerializesModels;

class PasswordChanged
{
    use SerializesModels;

    public $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }
}
