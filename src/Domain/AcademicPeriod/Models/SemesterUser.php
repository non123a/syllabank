<?php

namespace Domain\AcademicPeriod\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class SemesterUser extends Pivot
{
    public $table = 'semesters_users';
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'semester_id',
        'user_id',
    ];
}
