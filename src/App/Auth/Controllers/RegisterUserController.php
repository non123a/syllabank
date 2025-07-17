<?php

namespace App\Auth\Controllers;

use App\Http\Controllers\Controller;
use Domain\Auth\Actions\RegisterUser;
use Domain\Auth\DataTransferObjects\RegisterUserData;
use Illuminate\Http\Request;

class RegisterUserController extends Controller
{
    public function register(Request $request, RegisterUser $registerUser)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
            'name' => 'required|string|max:255',
            'identification_number' => 'required|string|max:12',
            'department_id' => 'required|exists:departments,id',
            'metadata' => 'required'
        ]);

        $registerUserData = new RegisterUserData(
            name: $validated['name'],
            email: $validated['email'],
            identification: $validated['identification_number'],
            metadata: $validated['metadata'],
            department_id: $validated['department_id']
        );

        $user = $registerUser->execute($registerUserData);

        return response()->json(['status' => __('User registered successfully')]);
    }
}