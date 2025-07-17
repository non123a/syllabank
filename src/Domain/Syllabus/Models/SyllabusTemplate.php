<?php

namespace Domain\Syllabus\Models;

use Illuminate\Database\Eloquent\Model;

class SyllabusTemplate extends Model
{
    protected $fillable = ['name', 'content', 'description', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}