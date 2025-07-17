<?php

namespace Domain\Syllabus\Actions;

use Domain\Course\DataTransferObjects\RetrieveTemplateContentData;
use Domain\School\Models\Section;

class RetrieveTemplateContent
{
    public function execute(RetrieveTemplateContentData $retrieveTemplateContentData)
    {
        /**
         * @var Section $section
         */
        $section = Section::findOrFail($retrieveTemplateContentData->sectionId);

        $content = $section->syllabus->content;

        return $content;
    }
}