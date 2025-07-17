<?php

namespace Domain\User\DataTransferObjects;

use Domain\User\Enums\EnglishLevels;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\Computed;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

class RegisterStudentData extends Data
{
    #[Computed]
    public string $academicYear;


    #[Computed]
    public string $academicSemester;

    public function __construct(
        public string $identification,
        public string $email,
        public string $name,
        public string $englishLevel,
        public string $academicPeriod
    ) {
        $academicPeriodSemester = explode('|', $academicPeriod);
        $this->academicYear = $academicPeriodSemester[0];
        $this->academicSemester = $academicPeriodSemester[1];
    }

    public static function rules(ValidationContext $context): array
    {
        return [
            'identification' => 'required|string',
            'email' => ['required', 'email', 'regex:/@paragoniu\.edu\.kh$/i'],
            'name' => 'required',
            'englishLevel' => [
                'nullable',
                Rule::in([
                    EnglishLevels::STARTER_LEVEL,
                    EnglishLevels::LEVEL_1,
                    EnglishLevels::LEVEL_2
                ])
            ],
            'academicPeriod' => 'required|string'
        ];
    }
}
