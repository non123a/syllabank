<?php

namespace Domain\Course\Actions;

use Domain\Course\Models\Course;
use Domain\Syllabus\DataTransferObjects\CreateSyllabusFromTemplateData;
use Domain\Syllabus\Models\Syllabus;
use Domain\Syllabus\States\SyllabusState;
use Illuminate\Contracts\Mail\Attachable;
use Illuminate\Support\Facades\View;

use function Amp\Dns\query;

class CreateSyllabusFromTemplate
{
    public function execute(CreateSyllabusFromTemplateData $data): Syllabus
    {
        $course = Course::findOrFail($data->courseId);

        $syllabus = new Syllabus();
        $syllabus->course_id = $course->id;
        $syllabus->syllabus_name = $data->syllabusName;
        $syllabus->status = $data->status;

        $templateContent = View::make('syllabi.syllabus_template', [
            'logo_path' => $data->logo_path,
            'course_code' => $data->course_code,
            'academic_year' => $data->academic_year,
            'semester' => $data->semester,
            'credits' => $data->credits,
            'content' => $data->content,
        ])->render();

        $syllabus->content = $templateContent;

        $syllabus->save();

        return $syllabus;
    }
}
