<?php

namespace Domain\Course\Actions;

use Domain\Syllabus\Models\Section;
use Domain\Course\DataTransferObjects\AssignACourseSectionToInstructorData;
use Domain\Course\Models\Course;

class AssignACourseSectionToInstructor
{
    public function execute(AssignACourseSectionToInstructorData $assignACourseSectionToInstructorData): Course
    {
        $course = Course::query()->find($assignACourseSectionToInstructorData->courseId);

        $course = Section::query()->find($assignACourseSectionToInstructorData->sectionId);

        $course->users()->hasRole('instructor')->attach($assignACourseSectionToInstructorData->instructorId);

        $course->users()->hasRole('instructor')->attach($assignACourseSectionToInstructorData->sectionId);

        $course->save();

        return $course;
    }
}
