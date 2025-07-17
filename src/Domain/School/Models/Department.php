<?php

namespace Domain\School\Models;

use Domain\Course\Models\Course;
use Domain\Syllabus\Models\Comment;
use Domain\Syllabus\Models\Syllabus;
use Domain\User\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'code_name',
        'full_name',
        'is_active',
        'description',
        'faculty_id'
    ];

    public function faculty(): BelongsTo
    {
        return $this->belongsTo(Faculty::class);
    }


    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}