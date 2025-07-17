<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Contracts\Support\Responsable;

class StudentAleardyEnrolledInRegularClassForTheSemester extends Exception implements Responsable
{
    public function toResponse($request)
    {
        return response()->json([
            'message' => 'Student is already enrolled in a regular class for this semester.'
        ], 400);
    }
}
