<?php

namespace Domain\Course\Actions;

use Domain\Course\DataTransferObjects\EnableACourseData;
use Domain\Course\Models\Course;

class EnableACourse
{
    public function execute(EnableACourseData $EnableACourseData)
    {
        Course::findOrFail($EnableACourseData->id)->update([
            'is_active' => true
        ]);
    }
}
