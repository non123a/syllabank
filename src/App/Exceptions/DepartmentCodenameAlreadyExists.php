<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Contracts\Support\Responsable;
use Illuminate\Http\JsonResponse;

class DepartmentCodenameAlreadyExists extends Exception implements Responsable
{
    public function toResponse($request)
    {
        return new JsonResponse([
            'message' => 'Department codename already exists'
        ], 422);
    }
}
