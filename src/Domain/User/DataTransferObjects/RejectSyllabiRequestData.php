<?php

namespace Domain\User\DataTransferObjects;

use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Data;

class RejectSyllabiRequestData extends Data
{
    public function __construct(
        #[FromRouteParameter('syllabusRequestId')]
        public $syllabusRequestId,
        public ?string $feedback,
    ) {
    }
}
