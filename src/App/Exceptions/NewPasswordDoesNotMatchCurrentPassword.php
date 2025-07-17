<?php

namespace App\Exceptions;

use Illuminate\Contracts\Support\Responsable;
use Illuminate\Http\JsonResponse;

class NewPasswordDoesNotMatchCurrentPassword extends \Exception implements Responsable
{
    public function toResponse($request)
    {
        return new JsonResponse([
            'message' => 'New password does not match current password'
        ], 400);
    }
}
