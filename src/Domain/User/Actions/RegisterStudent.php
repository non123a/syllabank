<?php

namespace Domain\User\Actions;

use Domain\User\DataTransferObjects\RegisterStudentData;
use Domain\User\Events\StudentRegistered;
use Domain\User\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class RegisterStudent
{
    public function excecute(RegisterStudentData $registerStudentData)
    {
        DB::beginTransaction();

        try {
            /**
             * @var User $user
             */
            $user = User::role('student')->firstOrCreate(
                [
                    'identification_number' => $registerStudentData->identification,
                    'email' => $registerStudentData->email,
                ],
                [
                    'identification_number' => $registerStudentData->identification,
                    'email' => $registerStudentData->email,
                    'name' => $registerStudentData->name,
                    'metadata' => [
                        'english_level' => $registerStudentData->englishLevel,
                    ],
                    // The line below is to enable Password sending via Email
                    'password' => Hash::make($generatedPassword = Str::random(8)),
                    // 'password' => Hash::make(Str::random(8)),
                ]
            );

            $user->semesters()->syncWithoutDetaching([$registerStudentData->academicSemester]);

            /**
             * !!! This line shall be uncommented for production !!!
             */
            StudentRegistered::dispatchIf($user->wasRecentlyCreated, $user, $generatedPassword);

            if (
                $user->exists &&
                $user->exitExamGrades()->whereIn(
                    'academic_year_id',
                    [$registerStudentData->academicYear]
                )->doesntExist()
            ) {
                /**
                 * @var \Domain\Class\Models\ExitExamGrade $exitExamGrade
                 */
                $exitExamGrade = $user->exitExamGrades()->make([
                    'value' => 0,
                ]);

                $exitExamGrade->academicYear()->associate($registerStudentData->academicYear)->save();
            }

            $user->syncRoles('student');

            DB::commit();

            return $user;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
