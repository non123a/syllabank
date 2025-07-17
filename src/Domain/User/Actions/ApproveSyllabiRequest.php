<?php

namespace Domain\User\Actions;

use Domain\Syllabus\Models\Syllabus;
use Domain\Syllabus\Models\SyllabusRequestForm;
use Domain\User\DataTransferObjects\ApproveSyllabiRequestData;
use Domain\User\Mails\SyllabusRequestApprovedMail;
use Illuminate\Support\Facades\Mail;
use Ismaelw\LaraTeX\LaratexCollection;

class ApproveSyllabiRequest
{
    public function execute(ApproveSyllabiRequestData $approveSyllabiRequestData)
    {
        $request = SyllabusRequestForm::findOrFail($approveSyllabiRequestData->syllabusRequestId)->updateOrFail([
            'is_approved' => true,
        ]);

        $request->refresh();

        $texCollection = new LaratexCollection();

        /**
         * I am assuming this courses columns are nothing more than an array of course names
         *
         * ['course1', 'course2', 'course3']
         */
        $syllabi = Syllabus::whereIn('course_name', collect($request->courses)->toArray())->get();

        foreach ($syllabi as $syllabus) {
            $texCollection->add($syllabus->compileContent('tex'));
        }

        Mail::to($request->student->email)->send(new SyllabusRequestApprovedMail(request()->user(), $request, $texCollection));
    }
}
