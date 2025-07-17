<?php

namespace Domain\AcademicPeriod\DataTransferObjects;

use Spatie\LaravelData\Data;

class GetAcademicYearByIdData extends Data
{
    public function __construct(
        public int $id
    ) {
    }

    public static function prepareForPipeline(array $properties): array
    {
        return [
            'id' => request()->route()->parameter('id'),
        ];
    }
}
