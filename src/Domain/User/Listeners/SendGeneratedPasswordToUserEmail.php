<?php

namespace Domain\User\Listeners;

use Domain\User\Events\UserRegistered;
use Domain\User\Mails\GeneratedPasswordMail;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendGeneratedPasswordToUserEmail implements ShouldQueue, ShouldHandleEventsAfterCommit
{
    use InteractsWithQueue;

    protected int $delay = 10;

    public function handle(UserRegistered $event)
    {
        $user = $event->user;

        $password = $event->password;

        Mail::to($user->email)->send(new GeneratedPasswordMail($user, $password));
    }
}
