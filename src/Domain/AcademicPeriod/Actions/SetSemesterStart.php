<?php

namespace Domain\AcademicPeriod\Actions;

use Domain\AcademicPeriod\DataTransferObjects\SetSemesterStartData;
use Domain\AcademicPeriod\Models\Semesters;
//Change use Semesters to Semester when removing old stuff
class SetSemesterStart
{
    public function execute(SetSemesterStartData $setSemesterStartData)
    {
        $semester = Semesters::query()->find($setSemesterStartData->semesterName);

        $semester->start_date = $setSemesterStartData->startDate;

        $semester->save();
    }
}
