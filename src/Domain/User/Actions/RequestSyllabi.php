<?php

namespace Domain\User\Actions;

use Domain\Syllabus\Models\SyllabusRequestForm;
use Domain\User\DataTransferObjects\RequestSyllabiData;

class RequestSyllabi
{
    public function execute(RequestSyllabiData $requestSyllabiData)
    {
        $request = SyllabusRequestForm::make([
            'courses' => $requestSyllabiData->courses,
            'description' => $requestSyllabiData->description,
        ]);

        $request->student()->associate(auth()->user());

        $request->headOfDepartment()->associate($requestSyllabiData->headOfDepartmentId);

        $request->save();
    }
}
