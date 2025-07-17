<?php

namespace Domain\AcademicPeriod\Actions;

use Domain\AcademicPeriod\DataTransferObjects\GetAcademicYearByIdData;
use Domain\AcademicPeriod\Models\AcademicYear;

class GetAcademicYearById
{
    public function execute(GetAcademicYearByIdData $data)
    {
        return AcademicYear::with('semesters')->findOrFail($data->id);
    }
}
