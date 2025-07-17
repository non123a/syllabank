<?php

namespace Domain\User\Actions;

use Domain\User\DataTransferObjects\UpdateAUserData;
use Domain\User\Models\User;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class UpdateAUser
{
    public function execute(UpdateAUserData $updateAUserData)
    {
        $user = User::with('department.faculty')->findOrFail($updateAUserData->userId);

        DB::beginTransaction();

        try {
            $user->name = $updateAUserData->name;
            $user->department()->associate($updateAUserData->departmentId);

            $this->validateRoles($user, $updateAUserData->roleIds);

            $user->syncRoles($updateAUserData->roleIds);
            $user->save();

            DB::commit();
            return $user;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
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
