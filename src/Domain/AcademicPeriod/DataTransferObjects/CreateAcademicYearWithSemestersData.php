<?php

namespace Domain\AcademicPeriod\DataTransferObjects;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * @property CreateAcademicYearData $academicYear
 */
class CreateAcademicYearWithSemestersData extends Data
{
    public function __construct(
        public CreateAcademicYearData $academicYear,
        #[DataCollectionOf(AcademicSemesterData::class)]
        public array $semesters
    ) {
    }

    public static function rules($context): array
    {
        return [
            'academicYear' => ['required'],
            'academicYear.startDate' => ['required', 'date', 'unique:academic_years,start_date'],
            'academicYear.endDate' => ['required', 'date', 'after:academicYear.startDate', 'unique:academic_years,end_date'],
            'semesters' => ['required', 'array'],
            'semesters.*.name' => ['required'],
            'semesters.*.startDate' => ['required', 'date', 'before:academicYear.endDate', 'after_or_equal:academicYear.startDate'],
            'semesters.*.endDate' => ['required', 'date', 'after:semesters.*.startDate', 'before_or_equal:academicYear.endDate'],
        ];
    }

    public static function messages(...$args): array
    {
        return [
            'academicYear.startDate.unique' => 'The academic year already exists.',
            'academicYear.endDate.unique' => 'The academic year already exists.',
            'semesters.*.startDate.before' => 'The semester start date must be before the academic year end date.',
            'semesters.*.startDate.after_or_equal' => 'The semester start date must be after or equal to the academic year start date.',
            'semesters.*.endDate.after' => 'The semester end date must be after the semester start date.',
            'semesters.*.endDate.before_or_equal' => 'The semester end date must be before or equal to the academic year end date.',
            'semesters.*.startDate.required' => 'The semester start date is required.',
            'semesters.*.endDate.required' => 'The semester end date is required.',
            'semesters.*.name.required' => 'The semester name is required.',
        ];
    }
}
