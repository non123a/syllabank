<?php

namespace Domain\User\Imports;

use Domain\AcademicPeriod\Models\Semester;
use Domain\User\Actions\RegisterStudent;
use Domain\User\DataTransferObjects\RegisterStudentData;
use Domain\User\Enums\EnglishLevels;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\PersistRelations;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithChunkReading;

class StudentImports implements ToCollection, WithValidation, WithHeadingRow, PersistRelations, WithChunkReading
{
    use Importable, SerializesModels;

    public function __construct(
        protected Semester $semester
    ) {
    }

    public function chunkSize(): int
    {
        return 100;
    }

    public function collection(Collection $rows)
    {
        DB::transaction(function () use ($rows) {
            foreach ($rows as $row) {

                $data = RegisterStudentData::factory()->withoutValidation()->from([
                    'identification' => $row['id'],
                    'email' => $row['email'],
                    'name' => $row['name'],
                    'englishLevel' => $row['english_level'] ?? null,
                    'academicPeriod' => $this->semester->academic_year_id . '|' . $this->semester->id,
                ]);


                (new RegisterStudent)->excecute($data);
            }
        });
    }

    public function rules(): array
    {
        return [
            'id' => 'required|distinct',
            'email' => 'required|distinct|email|regex:/@paragoniu\.edu\.kh$/i',
            'name' => 'required',
            'english_level' => [
                'nullable',
                Rule::in((new EnglishLevels)->toArray())
            ],
        ];
    }

    public function customValidationMessages()
    {
        return [
            'id.required' => 'The identification number is required',
            'id.distinct' => 'The identification number must be unique',
            'email.required' => 'The email is required',
            'email.distinct' => 'The email must be unique',
            'email.email' => 'The email must be a valid email address',
            'email.regex' => 'The email must be a valid Paragon email address',
            'name.required' => 'The name is required',
            'english_level.in' => 'The english level must be one of the following: ' . implode(', ', (new EnglishLevels)->toArray()),
        ];
    }
}
