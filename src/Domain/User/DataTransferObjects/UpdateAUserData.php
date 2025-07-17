<?php

namespace Domain\User\DataTransferObjects;

use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

class UpdateAUserData extends Data
{
    public function __construct(
        #[FromRouteParameter('id')]
        public $userId,
        public string $name,
        public int $departmentId,
        public $roleIds
    ) {
    }

    public static function rules(ValidationContext $context): array
    {
        return [
            'userId' => 'required|int|exists:users,id',
            'name' => 'required|string',
            'departmentId' => 'required|exists:departments,id',
            'roleIds' => 'required|array',
            'roleIds.*' => 'required|int|exists:roles,id',
        ];
    }
}
