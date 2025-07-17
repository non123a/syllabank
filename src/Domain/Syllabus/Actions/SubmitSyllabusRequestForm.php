<?php

namespace Domain\Syllabus\Actions;

use Domain\Syllabus\Models\SyllabusRequestForm;
use Domain\User\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SubmitSyllabusRequestForm
{
    public function execute(array $data)
    {
        $this->validateData($data);

        $user = Auth::user();
        $hod = $this->findHODForDepartment($user->department_id);

        if (!$hod) {
            throw new \Exception('No Head of Department found for the user\'s department');
        }

        return DB::transaction(function () use ($data, $user, $hod) {
            $syllabusRequestForm = new SyllabusRequestForm();
            $syllabusRequestForm->description = $data['description'];
            $syllabusRequestForm->forms = json_encode($data['forms']);
            $syllabusRequestForm->status = 'pending';
            $syllabusRequestForm->student_id = $user->id;
            $syllabusRequestForm->head_of_dept_id = $hod->id;

            // Use the first form's academic year and semester
            $firstForm = $data['forms'][0];
            $syllabusRequestForm->academic_year_id = $firstForm['academicYear']['id'];
            $syllabusRequestForm->semester_id = $firstForm['semester']['id'];

            $syllabusRequestForm->save();

            return $syllabusRequestForm;
        });
    }

    private function validateData(array $data)
    {
        $rules = [
            'description' => 'required|string',
            'forms' => 'required|array|min:1',
            'forms.*.academicYear' => 'required|array',
            'forms.*.academicYear.id' => 'required|integer|exists:academic_years,id',
            'forms.*.semester' => 'required|array',
            'forms.*.semester.id' => 'required|integer|exists:semesters,id',
            'forms.*.courses' => 'required|array|min:1',
            'forms.*.courses.*.id' => 'required|integer',
            'forms.*.courses.*.syllabus_name' => 'required|string',
            'forms.*.courses.*.sections' => 'required',
            'forms.*.courses.*.course_id' => 'required|integer',
            'forms.*.courses.*.instructors' => 'required|string',
            'forms.*.courses.*.created_at' => 'required|date',
            'forms.*.courses.*.updated_at' => 'required|date',
        ];

        $validator = validator($data, $rules);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }

    private function findHODForDepartment($departmentId)
    {
        return User::where('department_id', $departmentId)
            ->whereHas('roles', function ($query) {
                $query->where('name', 'hod');
            })
            ->first();
    }
}
