<?php

namespace Domain\User\Enums;

use Illuminate\Contracts\Support\Arrayable;

class EnglishLevels implements Arrayable
{
    public const STARTER_LEVEL = 'Starter Level';
    public const LEVEL_1 = 'Level 1';
    public const LEVEL_2 = 'Level 2';

    public function toArray(): array
    {
        return [
            self::STARTER_LEVEL,
            self::LEVEL_1,
            self::LEVEL_2
        ];
    }
}
