<?php

namespace Domain\User\Events;

use Domain\User\Models\User;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;

class StudentRegistered
{
    use Dispatchable, SerializesModels;

    public $user;

    public $password;

    public function __construct(User $user, string $password)
    {
        $this->user = $user;
        $this->password = $password;
    }
}
