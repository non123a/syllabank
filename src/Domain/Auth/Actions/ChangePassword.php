<?php

namespace Domain\Auth\Actions;

use App\Exceptions\NewPasswordDoesNotMatchCurrentPassword;
use Domain\Auth\DataTransferObjects\ChangePasswordData;
use Domain\User\Models\User;
use Illuminate\Support\Facades\Hash;

class ChangePassword
{
    public function execute(ChangePasswordData $changePasswordData)
    {
        $user = User::query()->find(auth()->id());

        if (!Hash::check($changePasswordData->oldPassword, $user->password)) {
            throw new NewPasswordDoesNotMatchCurrentPassword();
        }

        $user
            ->forceFill([
                'password' => Hash::make($changePasswordData->newPassword)
            ])
            ->save();
    }
}
