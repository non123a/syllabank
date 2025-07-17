<?php

namespace Domain\User\Actions;

use Domain\Syllabus\Models\SyllabusRequestForm;
use Domain\User\DataTransferObjects\RejectSyllabiRequestData;
use Domain\User\Mails\SyllabusRequestRejectedMail;
use Illuminate\Support\Facades\Mail;

class RejectSyllabiRequest
{
    public function __construct(protected RejectSyllabiRequestData $data)
    {
    }

    public function execute()
    {
        $request = SyllabusRequestForm::findOrFail($this->data->syllabusRequestId)->updateOrFail([
            'is_approved' => false,
            'feedback' => $this->data->feedback,
        ]);

        $request->refresh();

        if($request->wasChanged()) {
            Mail::to($request->student->email)->send(new SyllabusRequestRejectedMail(request()->user(), $request));
        }
    }
}
