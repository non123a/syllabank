<?php

namespace Domain\Course\Actions;

use Domain\Course\DataTransferObjects\RemoveACourseFromInstructorData;
use Domain\Course\Models\Course;

class RemoveACourseFromInstructor
{
    public function execute(RemoveACourseFromInstructorData $removeACourseFromInstructorData)
    {
        $course = Course::query()->find($removeACourseFromInstructorData->courseId);

        $course->users()->hasRole('instructor')->detach($removeACourseFromInstructorData->instructorId);

        $course->save();
    }
}
