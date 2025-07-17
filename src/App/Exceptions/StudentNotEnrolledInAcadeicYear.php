<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Contracts\Support\Responsable;

class StudentNotEnrolledInAcadeicYear extends Exception implements Responsable
{
    public function toResponse($request)
    {
        return response()->json([
            'message' => 'Student is not enrolled in the academic year of the section.'
        ], 422);
    }
}
