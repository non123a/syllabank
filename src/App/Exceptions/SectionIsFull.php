<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Contracts\Support\Responsable;

class SectionIsFull extends Exception implements Responsable
{
    public function toResponse($request)
    {
        return response()->json([
            'message' => 'Section is full.'
        ], 422);
    }
}
