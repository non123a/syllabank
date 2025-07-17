<?php

namespace Domain\School\DataTransferObjects;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Support\Validation\ValidationContext;

class DisableADepartmentData extends Data
{
    public function __construct(
        #[FromRouteParameter('id')]
        public int $id,
    ) {}

    public static function rules(ValidationContext $context): array
    {
        return [
            'id' => 'required|exists:departments,id',
        ];
    }
}
