<?php

namespace Domain\AcademicPeriod\Models;

use Domain\Class\Models\_Class;
use Domain\Class\Models\Grade;
use Domain\Class\Models\GradeApprovalRequest;
use Domain\Class\Models\GradeSubmission;
use Domain\Class\Models\Section;
use Domain\Course\Models\Course;
use Domain\School\Models\Section as ModelsSection;
use Domain\User\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Staudenmeir\EloquentHasManyDeep\HasManyDeep;

class Semester extends Model
{
    use
        \Znck\Eloquent\Traits\BelongsToThrough,
        \Staudenmeir\EloquentHasManyDeep\HasRelationships;

    protected $fillable = [
        'semester_number',
        'start_date',
        'end_date',
        'academic_year_id',
    ];

    protected $casts = [
        'start_date' => 'datetime',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function academicYear(): BelongsToMany
    {
        return $this->belongsToMany(AcademicYear::class);
    }

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }

    public function sections(): HasManyThrough
    {
        return $this->hasManyThrough(ModelsSection::class, Course::class, 'semester_id', 'course_id');
    }
}
