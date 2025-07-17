<?php

namespace App\Auth\Resources;

use Domain\User\Models\User;
use Domain\School\Models\Department;
use Spatie\LaravelData\Data;

class MeResource extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
        public ?string $identification_number,
        public $metadata,
        public $roles = [],
        public $permissions = [],
        public $has2FA,
        public $department = [],
        public $faculty
    ) {}

    public static function fromModel(User $user): self
    {
        return new self(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            identification_number: $user->identification_number,
            metadata: $user->metadata,
            roles: $user->getRoleNames()->toArray(),
            permissions: $user->getAllPermissions()->pluck('name')->toArray(),
            has2FA: $user->hasEnabledTwoFactorAuthentication(),
            department: $user->department?->code_name,
            faculty: $user->department?->faculty->code_name
        );
    }
}