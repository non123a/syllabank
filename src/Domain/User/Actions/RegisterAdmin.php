<?php

namespace Domain\User\Actions;

use Domain\User\DataTransferObjects\RegisterAdminData;
use Illuminate\Support\Facades\Hash;
use Domain\User\Models\User;
use Illuminate\Support\Str;

class RegisterAdmin
{
    public function excecute(RegisterAdminData $registerAdminData)
    {
        $generatedPassword = Str::random(8);

        $user = User::firstOrCreate(
            [
                'identification_number' => $registerAdminData->identification,
            ],
            [
                'identification_number' => $registerAdminData->identification,
                'email' => $registerAdminData->email,
                'name' => $registerAdminData->name,
                'password' => Hash::make($generatedPassword)
            ]
        );

        $user->syncRoles('admin');

        return $user;
    }
}
