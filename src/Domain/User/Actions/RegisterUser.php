<?php

namespace Domain\User\Actions;

use Domain\User\DataTransferObjects\RegisterUserData;
use Domain\User\Events\StudentRegistered;
use Domain\User\Events\UserRegistered;
use Domain\User\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class RegisterUser
{
    public function execute(RegisterUserData $data): bool
    {
        DB::beginTransaction();

        try {
            $user = User::make([
                'identification_number' => $data->identification_number,
                'email' => $data->email,
                'name' => $data->name,
                'password' => Hash::make($generatedPassword = Str::random(8)),
            ]);

            $user->department()->associate($data->departmentId);

            $roleIds = $data->roleIds;

            $this->validateRoles($user, $roleIds);

            $user->syncRoles($roleIds);
            $user->save();

            UserRegistered::dispatch($user, $generatedPassword);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return $user->wasRecentlyCreated;
    }

    private function validateRoles(User $user, array $roleIds)
    {
        $roles = Role::whereIn('id', $roleIds)->get();

        foreach ($roles as $role) {
            if ($role->name === 'hod') {
                $this->validateHodRole($user);
            } elseif ($role->name === 'dean') {
                $this->validateDeanRole($user);
            }
        }
    }

    private function validateHodRole(User $user)
    {
        $existingHod = User::role('hod')
            ->where('department_id', $user->department_id)
            ->where('id', '!=', $user->id)
            ->first();

        if ($existingHod) {
            throw new \Exception('Another Head of Department already exists for this department.');
        }
    }

    private function validateDeanRole(User $user)
    {
        $existingDean = User::role('dean')
            ->whereHas('department.faculty', function ($query) use ($user) {
                $query->whereHas('departments', function ($subQuery) use ($user) {
                    $subQuery->where('id', $user->department_id);
                });
            })
            ->where('id', '!=', $user->id)
            ->first();

        if ($existingDean) {
            throw new \Exception('Another Dean already exists for this faculty.');
        }
    }
}
