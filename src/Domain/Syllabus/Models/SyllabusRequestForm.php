<?php

namespace Domain\Syllabus\Models;

use Domain\User\Models\User;
use Domain\AcademicPeriod\Models\AcademicYear;
use Domain\AcademicPeriod\Models\Semester;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SyllabusRequestForm extends Model
{
    use HasFactory;

    protected $table = 'syllabus_request_forms';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'forms',
        'description',
        'feedback',
        'status',
        'student_id',
        'head_of_dept_id',
        'academic_year_id',
        'semester_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [];


    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'forms' => 'json',
    ];

    public function requester()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'head_of_dept_id');
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id');
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }
}
