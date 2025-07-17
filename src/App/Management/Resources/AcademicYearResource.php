<?php

namespace App\Management\Resources;

use Domain\AcademicPeriod\Models\AcademicYear;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapOutputName;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\LaravelData\Resource;


#[MapOutputName(SnakeCaseMapper::class)]
class AcademicYearResource extends Resource
{
    public function __construct(
        public int $id,
        public $startDate,
        public $endDate,
        #[DataCollectionOf(AcademicSemesterResource::class)]
        public $semesters
    ) {
        //
    }

    public static function fromModel(AcademicYear $model): self
    {
        return new self(
            id: $model->id,
            startDate: $model->start_date,
            endDate: $model->end_date,
            semesters: AcademicSemesterResource::collect($model->semesters)
        );
    }
}
