<?php

namespace Domain\Course\Actions;

use Domain\Course\DataTransferObjects\UpdateCourseData;
use Domain\Course\Models\Course;
use Illuminate\Support\Facades\DB;

class UpdateCourse
{
    public function execute(int $courseId, UpdateCourseData $updateCourseData)
    {
        $course = Course::findOrFail($courseId);

        $course->update([
            'course_subject' => $updateCourseData->subject,
            'course_name' => $updateCourseData->name,
            'course_code' => $updateCourseData->code,
            'description' => $updateCourseData->description,
        ]);
    }
}
