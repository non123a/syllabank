<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SyllabiReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public $upcomingSemesters;

    public function __construct($upcomingSemesters)
    {
        $this->upcomingSemesters = $upcomingSemesters;
    }

    public function build()
    {
        return $this->view('emails.syllabi_reminder')
            ->subject('Reminder: Upcoming Syllabi Submissions');
    }
}
