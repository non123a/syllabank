<?php

namespace Domain\Course\Models;

use Domain\AcademicPeriod\Models\AcademicYear;
use Domain\AcademicPeriod\Models\Semester;
use Domain\School\Models\Section;
use Domain\Syllabus\Models\Syllabus;
use Domain\User\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory;

    protected $table = 'courses';

    protected $fillable = [
        'course_subject',
        'course_name',
        'course_code',
        'description',
        'is_active',
        'author_id',
    ];

    protected $casts = [
        'course_subject' => 'string',
        'course_name' => 'string',
        'course_code' => 'string',
        'description' => 'string',
        'is_active' => 'boolean',
    ];

    public function sections(): HasMany
    {
        return $this->hasMany(Section::class);
    }

    public function syllabi(): HasMany
    {
        return $this->hasMany(Syllabus::class);
    }

    public function academicYears(): BelongsToMany
    {
        return $this->belongsToMany(AcademicYear::class, 'course_academic_year_semester')
            ->withPivot('semester_id')
            ->withTimestamps();
    }

    public function semesters(): BelongsToMany
    {
        return $this->belongsToMany(Semester::class, 'course_academic_year_semester')
            ->withPivot('academic_year_id')
            ->withTimestamps();
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'course_user')
            ->withTimestamps();
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}