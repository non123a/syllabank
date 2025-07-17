<?php

namespace Domain\Course\DataTransferObjects;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Boolean;

class UpdateCourseData extends Data
{
    public function __construct(
        public string $subject,
        public string $name,
        public string $code,
        public ?string $description,
    ) {
    }
}
