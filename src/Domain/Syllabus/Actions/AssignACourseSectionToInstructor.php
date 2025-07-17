<?php

namespace Domain\Syllabus\Actions;

use Domain\Course\DataTransferObjects\AssignACourseSectionToInstructorData;
use Domain\Course\DataTransferObjects\CreateASyllabusData;
use Domain\Syllabus\Models\Section;
use Illuminate\Support\Facades\DB;

class AssignACourseSectionToInstructor
{
    public function __construct(protected CreateASyllabus $createASyllabus)
    {
    }

    public function execute(AssignACourseSectionToInstructorData $assignACourseSectionToInstructorData)
    {
        DB::transaction(function () use ($assignACourseSectionToInstructorData) {

            $section = Section::findOrFail($assignACourseSectionToInstructorData->sectionId);

            $section->author()->associate($assignACourseSectionToInstructorData->instructorId)->save();

            $syllabus = $this->createASyllabus->execute(CreateASyllabusData::from([
                'syllabusName' => $section->academicYear()->start_and_end . $section->course->name . $section->course->code,
                'content' => '',
            ]));

            $section->syllabus()->delete();

            $section->syllabus()->associate($syllabus)->save();
        });
    }
}
