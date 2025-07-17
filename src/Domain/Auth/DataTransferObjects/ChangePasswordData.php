<?php

namespace Domain\Auth\DataTransferObjects;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class ChangePasswordData extends Data
{
    public function __construct(
        public string $oldPassword,
        public string $newPassword,
        public string $confirmNewPassword
    ) {
    }

    public static function rules(): array
    {
        return [
            "oldPassword" => [new Required(), new StringType(), new Max(255)],
            "newPassword" => [new Required(), new StringType(), new Max(255)],
            "confirmNewPassword" => [new Required(), new StringType(), new Max(255), "same:newPassword"]
        ];
    }
}
