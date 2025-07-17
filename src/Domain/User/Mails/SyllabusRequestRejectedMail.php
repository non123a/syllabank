<?php

namespace Domain\User\Mails;

use Domain\Syllabus\Models\SyllabusRequestForm;
use Domain\User\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Queue\SerializesModels;

class SyllabusRequestRejectedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public User $rejectedBy;

    public SyllabusRequestForm $syllabusRequestForm;

    public function __construct(User $rejectedBy, SyllabusRequestForm $syllabusRequestForm)
    {
        $this->rejectedBy = $rejectedBy;
        $this->syllabusRequestForm = $syllabusRequestForm;

    }

    public function build()
    {
        $view = $this
            ->from(new Address($this->rejectedBy->email, $this->rejectedBy->name))
            ->view('emails.syllabus_request_rejected')
            ->with([
                'name' => $this->syllabusRequestForm->student->name,
                'courses' => $this->syllabusRequestForm->courses ?? [],
                'academic_year' => $this->syllabusRequestForm->academicYear->start_and_end ?? '',
                'feedback' => $this->syllabusRequestForm->feedback ?? 'No feedback provided.',
            ]);

        return $view;
    }
}
