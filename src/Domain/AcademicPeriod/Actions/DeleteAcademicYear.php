<?php

namespace Domain\AcademicPeriod\Actions;

use Domain\AcademicPeriod\Models\AcademicYear;

class DeleteAcademicYear
{
    public function execute($id)
    {
        AcademicYear::findOrFail($id)->delete();
    }
}
