<?php

namespace Domain\Course\DataTransferObjects;

use Spatie\LaravelData\Data;

class RetrieveTemplateContentData extends Data
{
    public function __construct(
        public $sectionId,
    ) {
    }
}
