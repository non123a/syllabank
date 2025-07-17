<?php

namespace Domain\User\DataTransferObjects;

use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Data;

class ApproveSyllabiRequestData extends Data
{
    public function __construct(
        #[FromRouteParameter('syllabusRequestId')]
        public $syllabusRequestId,
    ) {
    }
}
