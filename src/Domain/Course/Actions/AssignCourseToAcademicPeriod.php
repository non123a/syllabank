<?php

namespace Domain\Course\Actions;

use Domain\Course\DataTransferObjects\AssignCourseToAcademicPeriodData;
use Domain\Course\Models\Course;
use Domain\AcademicPeriod\Models\AcademicYear;
use Domain\AcademicPeriod\Models\Semester;

class AssignCourseToAcademicPeriod
{
    public function execute(AssignCourseToAcademicPeriodData $data): bool
    {
        $course = Course::findOrFail($data->course_id);
        $academicYear = AcademicYear::findOrFail($data->academic_year_id);
        $semester = Semester::findOrFail($data->semester_id);

        $course->academicYears()->attach($academicYear->id, ['semester_id' => $semester->id]);

        return true;
    }
}
