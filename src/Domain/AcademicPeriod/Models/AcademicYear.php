<?php

namespace Domain\AcademicPeriod\Models;

use Domain\Class\Models\_Class;
use Domain\Class\Models\ExitExamGrade;
use Domain\Class\Models\Grade;
use Domain\Class\Models\GradeApprovalRequest;
use Domain\Class\Models\GradeSubmission;
use Domain\Course\Models\Course;
use Domain\School\Models\Section;
use Domain\User\Models\User;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Staudenmeir\EloquentHasManyDeep\HasManyDeep;

class AcademicYear extends Model
{
    use \Znck\Eloquent\Traits\BelongsToThrough,
        \Staudenmeir\EloquentHasManyDeep\HasRelationships;

    protected $table = 'academic_years';

    protected $fillable = [
        'start_date',
        'end_date',
        'is_active',
        'semester_id',
        'course_id',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_active' => 'boolean',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected function startAndEnd(): Attribute
    {
        return new Attribute(function ($value) {
            return Carbon::parse($this->start_date)->format('YYYY') . '-' . Carbon::parse($this->end_date)->format('YYYY');
        });
    }

    public function semesters(): HasMany
    {
        return $this->hasMany(Semester::class);
    }

    public function sections(): HasManyThrough
    {
        return $this->hasManyThrough(Section::class, Semester::class);
    }

    // public function courses(): BelongsToMany
    // {
    //     return $this->belongsToMany(Course::class)
    //         ->withTimestamps();
    // }

    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'courses_academic_years_semesters_users')->withTimestamps();
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'courses_academic_years')
            ->using(Course::class)
            ->withPivot('course_id')
            ->withTimestamps();
    }

    // public function exitExamGrades()
    // {
    //     return $this->hasMany(ExitExamGrade::class);
    // }

    // public function grades(): HasManyDeep
    // {
    //     return $this->hasManyDeep(
    //         Grade::class,
    //         [Semester::class, _Class::class, Section::class, GradeApprovalRequest::class, GradeSubmission::class],
    //         [null, null, 'class_id', 'class_section_id', null]
    //     );
    // }

    // public function regularGrades(): HasManyDeep
    // {
    //     return $this
    //         ->grades()
    //         ->whereHas('gradeCriteria', function ($query) {
    //             $query->where('criteria_name', '!=', 'Summer');
    //         });
    // }

    // public function summerGrades(): HasManyDeep
    // {
    //     return $this
    //         ->grades()
    //         ->whereHas('gradeCriteria', function ($query) {
    //             $query->where('criteria_name', 'Summer');
    //         });
    // }
}
