<?php

namespace Domain\Course\Actions;

use Domain\Course\DataTransferObjects\DisableACourseData;
use Domain\Course\Models\Course;

class DisableACourse
{
    public function execute(DisableACourseData $disableACourseData)
    {
        Course::findOrFail($disableACourseData->id)->update([
            'is_active' => false
        ]);
    }
}
