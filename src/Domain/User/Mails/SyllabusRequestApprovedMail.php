<?php

namespace Domain\User\Mails;

use Domain\Syllabus\Models\SyllabusRequestForm;
use Domain\User\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Ismaelw\LaraTeX\LaratexCollection;

class SyllabusRequestApprovedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public User $approvedBy;

    public SyllabusRequestForm $syllabusRequestForm;

    public LaratexCollection $syllabiCollection;

    public function __construct(User $approvedBy, SyllabusRequestForm $syllabusRequestForm, LaratexCollection $syllabi)
    {
        $this->approvedBy = $approvedBy;
        $this->syllabusRequestForm = $syllabusRequestForm;
        $this->syllabi = $syllabi;

    }

    public function build()
    {
        $tempPath = Storage::disk('local')->path('temp/' . $this->syllabusRequestForm->academicYear->start_and_end . uniqid() . '.zip');

        $view = $this
            ->from($this->approvedBy->email)
            ->view('emails.syllabus_request_approved')
            ->with([
                'name' => $this->syllabusRequestForm->student->name,
                'courses' => $this->syllabusRequestForm->courses ?? '',
                'feedback' => $this->syllabusRequestForm->feedback ?? 'No feedback provided.',
            ])
            ->attach($this->syllabiCollection->saveZip($tempPath), [
                'mime' => 'application/zip',
            ]);

        return $view;
    }
}
