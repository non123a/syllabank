<?php

namespace App\Exceptions;

use Illuminate\Contracts\Support\Responsable;

class StudentAlreadyEnrolledInSummerClassForTheAcademicYear extends \Exception implements Responsable
{
    public function toResponse($request)
    {
        return response()->json([
            'message' => 'Student is already enrolled in a summer class for this academic year.'
        ], 400);
    }
}
