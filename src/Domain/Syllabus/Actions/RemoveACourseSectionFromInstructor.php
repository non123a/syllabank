<?php

namespace Domain\Syllabus\Actions;

use Domain\Course\DataTransferObjects\RemoveACourseSectionFromInstructorData;
use Domain\School\Models\Section;
use Illuminate\Support\Facades\DB;

class RemoveACourseSectionFromInstructor
{
    public function execute(RemoveACourseSectionFromInstructorData $removeACourseSectionFromInstructorData)
    {
        DB::transaction(function () use ($removeACourseSectionFromInstructorData) {
            $section = Section::findOrFail($removeACourseSectionFromInstructorData->sectionId);
            $section->author()->dissociate()->save();
            // Since the syllabus is created when the section is created
            // we ought delete the syllabus when the section is deleted
            $section->syllabus()->delete();
        });
    }
}