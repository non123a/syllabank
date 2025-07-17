<?php

namespace App\Management\Resources;

use Domain\AcademicPeriod\Models\Semester;
use Spatie\LaravelData\Attributes\MapOutputName;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\LaravelData\Resource;

#[MapOutputName(SnakeCaseMapper::class)]
class AcademicSemesterResource extends Resource
{
    public function __construct(
        public int $id,
        public int $number,
        public $startDate,
        public $endDate,
    ) {
        //
    }

    public static function fromModel(Semester $model): self
    {
        return new self(
            id: $model->id,
            number: $model->semester_number,
            startDate: $model->start_date,
            endDate: $model->end_date,
        );
    }
}
