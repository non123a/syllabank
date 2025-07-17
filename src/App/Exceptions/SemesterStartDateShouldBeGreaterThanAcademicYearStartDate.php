<?php

namespace App\Exceptions;

use Illuminate\Contracts\Support\Responsable;

class SemesterStartDateShouldBeGreaterThanAcademicYearStartDate extends \Exception implements Responsable
{
    public function toResponse($request)
    {
        return response()->json([
            'message' => 'Semester start date should be greater than academic year start date'
        ], 400);
    }
}
