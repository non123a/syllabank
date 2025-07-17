<?php

namespace Domain\School\DataTransferObjects;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;

class UpdateDepartmentData extends Data
{
    public function __construct(

        public $departmentId,

        #[Required, StringType, Max(255)]
        public string $code_name,

        #[Required, StringType, Max(255)]
        public string $full_name,

        #[Nullable, StringType]
        public ?string $description,

        #[Required]
        public $facultyId
    ) {}
}
