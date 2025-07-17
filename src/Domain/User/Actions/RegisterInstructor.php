<?php

namespace Domain\User\Actions;

use Domain\User\DataTransferObjects\RegisterInstructorData;
use Domain\User\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class RegisterInstructor
{
    public function excecute(RegisterInstructorData $registerInstructorData)
    {
        $generatedPassword = Str::random(8);

        $user = User::firstOrCreate(
            [
                'identification_number' => $registerInstructorData->identification,
            ],
            [
                'identification_number' => $registerInstructorData->identification,
                'email' => $registerInstructorData->email,
                'name' => $registerInstructorData->name,
                'password' => Hash::make($generatedPassword)
            ]
        );

        $user->syncRoles('instructor');

        return $user;
    }
}
