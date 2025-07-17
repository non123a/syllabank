<?php

namespace App\Exceptions;

use Illuminate\Contracts\Support\Responsable;

class SemesterEndDateShouldBeLesserThanAcademicYearEndDate extends \Exception implements Responsable
{
    public function toResponse($request)
    {
        return response()->json([
            'message' => 'Semester end date should be less than academic year end date'
        ], 400);
    }
}
