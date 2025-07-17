<?php

namespace Domain\Course\Actions;

use Domain\Course\DataTransferObjects\CreateCourseData;
use Domain\Course\Models\Course;
use Illuminate\Support\Facades\DB;

class CreateCourse
{
    public function execute(CreateCourseData $data, bool $forceContinue = false)
    {
        $existingCourse = $data->checkExistingCourse();

        if ($existingCourse && !$forceContinue) {
            return [
                'status' => 'duplicate',
                'message' => 'A course with the subject "' . $data->subject . '" and code "' . $data->code . '" already exists.',
                'existingCourse' => $existingCourse,
            ];
        }

        return DB::transaction(function () use ($data, $existingCourse) {
            $code = $existingCourse ? $this->generateUniqueCode($data->subject, $data->code) : $data->code;

            $course = Course::create([
                'course_subject' => $data->subject,
                'course_name' => $data->name,
                'course_code' => $code,
                'description' => $data->description,
                'is_active' => $data->isActive,
                'author_id' => auth()->user()->id,
            ]);

            return [
                'status' => 'success',
                'message' => 'Course created successfully',
                'course' => $course,
            ];
        });
    }

    private function generateUniqueCode(string $subject, string $code): string
    {
        $baseCode = $code;
        $count = 0;

        while (Course::where('course_subject', $subject)->where('course_code', $code)->exists()) {
            $count++;
            $code = $baseCode . '-' . $count;
        }

        return $code;
    }
}
