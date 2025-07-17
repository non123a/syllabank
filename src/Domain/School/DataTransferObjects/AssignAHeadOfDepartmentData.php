<?php

namespace Domain\School\DataTransferObjects;

use Spatie\LaravelData\Data;

class AssignAHeadOfDepartmentData extends Data
{
    public function __construct(
        public int $userId,
        public int $departmentId
    ) {}
}
