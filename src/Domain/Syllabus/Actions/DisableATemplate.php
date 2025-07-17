<?php

namespace Domain\Syllabus\Actions;

use Domain\Syllabus\Models\SyllabusTemplate;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class DisableATemplate
{
    public function execute($templateId)
    {

        $template = SyllabusTemplate::find($templateId);

        if (!$template) {
            throw new ModelNotFoundException("Syllabus template with ID {$templateId} not found.");
        }

        $template->update(['is_active' => false]);
        return $template;
    }
}