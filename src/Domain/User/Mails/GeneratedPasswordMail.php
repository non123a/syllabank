<?php

namespace Domain\User\Mails;

use Domain\User\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class GeneratedPasswordMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $user;

    public string $password;

    public function __construct(User $user, string $password)
    {
        $this->user = $user;
        $this->password = $password;
    }

    public function build()
    {
        return $this->view('emails.generated_password')
            ->with([
                'name' => $this->user->name,
                'password' => $this->password,
            ]);
    }
}
