<?php

namespace Domain\AcademicPeriod\Actions;

use Domain\AcademicPeriod\Models\AcademicYear;

class ListAcademicYears
{
    public function execute()
    {
        return AcademicYear::with('semesters')
            ->orderBy('start_date', 'desc')
            ->get();
    }
}
