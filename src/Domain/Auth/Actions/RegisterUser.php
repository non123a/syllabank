<?php

namespace Domain\Auth\Actions;

use Domain\Auth\DataTransferObjects\RegisterUserData;
use Domain\User\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Domain\User\Events\StudentRegistered;
use Illuminate\Support\Str;

class RegisterUser
{
    public function execute(RegisterUserData $registerUserData)
    {
        DB::beginTransaction();

        try {

            /**
             * @var User $user
             */
            $user = User::role('student')->firstOrCreate(
                [
                    'email' => $registerUserData->email,
                    'name' => $registerUserData->name,
                    'password' => Hash::make($generatedPassword = Str::random(8)),
                    'identification_number' => $registerUserData->identification,
                    'metadata' => $registerUserData->metadata,
                    'department_id' => $registerUserData->department_id,
                ],
            );


            /**
             * !!! This line shall be uncommented for production !!!
             */
            StudentRegistered::dispatchIf($user->wasRecentlyCreated, $user, $generatedPassword);


            $user->syncRoles('student');

            DB::commit();

            return $user;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}