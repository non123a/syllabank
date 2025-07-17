<?php

namespace Domain\User\Models;

use Domain\AcademicPeriod\Models\AcademicYear;
use Domain\AcademicPeriod\Models\Semester;
use Domain\AcademicPeriod\Models\Semesters;
use Domain\AcademicPeriod\Models\SemesterUser;
use Domain\Course\Models\Course;
use Domain\School\Models\Department;
use Domain\School\Models\Faculty;
use Domain\School\Models\Section;
use Domain\Syllabus\Models\Syllabus;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Collection;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;
use Staudenmeir\EloquentHasManyDeep\HasManyDeep;
use Staudenmeir\EloquentHasManyDeep\HasOneDeep;
use Znck\Eloquent\Relations\BelongsToThrough;

class User extends Authenticatable
{
    use HasFactory,
        Notifiable,
        HasRoles,
        TwoFactorAuthenticatable,
        \Staudenmeir\EloquentHasManyDeep\HasTableAlias,
        \Znck\Eloquent\Traits\BelongsToThrough,
        \Staudenmeir\EloquentHasManyDeep\HasRelationships;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'identification_number',
        'email',
        'password',
        'metadata',
        'is_active',
        'department_id',
        'academic_year_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'metadata' => 'object',
        'is_active' => 'boolean',
        'department_id' => 'integer',
    ];

    public function sendPasswordResetNotification($token)
    {
        $resetPassword = new ResetPassword($token);

        $resetPassword::$createUrlCallback = function ($notifiable, $token) {

            return env('RESET_PASSWORD_URL')
                . '?token=' . $token
                . '&email=' . $notifiable->getEmailForPasswordReset();
        };

        $this->notify($resetPassword);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function faculty(): BelongsToThrough
    {
        return $this->belongsToThrough(Faculty::class, Department::class);
    }




    // public function courses(): HasManyThrough
    // {
    //     return $this->hasManyThrough(Course::class, Section::class);
    // }


    public function syllabi(): HasManyThrough
    {
        return $this->hasManyThrough(Syllabus::class, Course::class);
    }

    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'users_courses')
            ->withTimestamps();
    }

    public function courseAssignments(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'courses_academic_years_semesters_users')
            ->withPivot('academic_year_id', 'semester_id', 'head_of_dept_id', 'is_active')
            ->withTimestamps();
    }

    public function sections(): HasManyDeep
    {
        return $this->hasManyDeep(
            Section::class,
            [Course::class],
            [
                'id', // Foreign key on the "courses" table.
                'course_id' // Foreign key on the "sections" table.
            ],
            [
                'id', // Local key on the "users" table.
                'id' // Local key on the "courses" table.
            ]
        )->wherePivot('users_courses.academic_year_id', '=', 'courses.academic_year_id');
    }



    public function academicYears(): HasManyDeep
    {
        return $this->hasManyDeep(
            AcademicYear::class,
            [Course::class],
            ['id', 'academic_year_id'],
            ['id', 'id']
        )->distinct();
    }

    public function instructors()
    {
        return $this->whereHas('roles', function ($query) {
            $query->where('name', 'instructor');
        });
    }

    // public function latestAcademicYear(): HasOneDeep
    // {
    //     return $this->hasOneDeep(
    //         AcademicYear::class,
    //         [User::class, SemesterUser::class, Semester::class],
    //         ['id', 'user_id', 'id', 'id'],
    //         ['id', 'id', 'semester_id', 'academic_year_id']
    //     );
    // }

    // public function isDeanOfDepartment(?Department $department = null): bool
    // {
    //     // First, check if the user has the 'dean' role
    //     if (!$this->hasRole('dean')) {
    //         return false;
    //     }

    //     // If no specific department is provided, check if the user is a dean of any department
    //     if ($department === null) {
    //         return $this->department()->exists();
    //     }

    //     // Check if the user is the dean of the specified department
    //     return $this->department_id === $department->id;
    // }

    // /**
    //  * Get the semesters that the user is studying in.
    //  */
    // public function studySemesters(): HasManyDeep
    // {
    //     return $this->hasManyDeep(
    //         Semester::class,
    //         [SectionUser::class, Section::class, _Class::class],
    //         ['user_id', null, 'id', 'id'],
    //         [null, 'class_section_id', 'class_id', 'semester_id']
    //     );
    // }

    // public function hasSemester(Semester $semester): bool
    // {
    //     return $this->semesters->contains($semester);
    // }


    // /**
    //  * Get the grades for the user.
    //  */
    // public function grades(): HasManyThrough
    // {
    //     return $this->hasManyThrough(Grade::class, GradeSubmission::class, 'student_id');
    // }

    // /**
    //  * Get the regular grades for the user.
    //  */
    // public function regularGrades(): HasManyThrough
    // {
    //     return $this->grades()->whereHas('gradeCriteria', function ($query) {
    //         $query->where('criteria_name', '!=', 'Summer');
    //     });
    // }

    // /**
    //  * Get the summer grades for the user.
    //  */
    // public function summerGrades(): HasManyThrough
    // {
    //     return $this->grades()->whereHas('gradeCriteria', function ($query) {
    //         $query->where('criteria_name', 'Summer');
    //     });
    // }

    // /**
    //  * Get the grade submissions for the user.
    //  */
    // public function gradeSubmissions(): HasMany
    // {
    //     return $this->hasMany(GradeSubmission::class, 'student_id');
    // }

    // /**
    //  * Get the grade approval requests for the user.
    //  */
    // public function gradeApprovalRequests(): HasMany
    // {
    //     return $this->hasMany(GradeApprovalRequest::class, 'instructor_id');
    // }

    // public function classes(): HasManyDeep
    // {
    //     return $this->hasManyDeep(
    //         _Class::class,
    //         [SectionUser::class, Section::class],
    //         [null, null, 'id'],
    //         [null, 'class_section_id', 'class_id']
    //     );
    // }

    // /**
    //  * Get the exit exam grade for the user.
    //  */
    // public function exitExamGrades(): HasMany
    // {
    //     return $this->hasMany(ExitExamGrade::class, 'student_id');
    // }

    // /**
    //  * Get the exit exam grade for a year for the user.
    //  *
    //  * @return HasOne
    //  */
    // public function exitExamGradeForAYear(): HasOne
    // {
    //     return $this
    //         ->exitExamGrades()
    //         ->one();
    // }

    // /**
    //  * Get the teaching sections for the instructor user.
    //  */
    // public function teachingSections(): HasMany
    // {
    //     return $this->hasMany(Section::class, 'instructor_id');
    // }

    // /**
    //  * Get the teaching academic years for the instructor user.
    //  */
    // public function teachingAcademicYears(): HasManyDeep
    // {
    //     return $this->hasManyDeep(
    //         AcademicYear::class,
    //         [Section::class, _Class::class, Semester::class],
    //         ['instructor_id', 'id', 'id', 'id'],
    //         ['id', 'class_id', 'semester_id', 'academic_year_id']
    //     )->distinct();
    // }

    // public function semester1Grades()
    // {
    //     return $this->regularGrades()
    //         ->whereHas('semester', function ($query) {
    //             $query->where('semester_number', 1);
    //         });
    // }

    // public function semester2Grades()
    // {
    //     return $this->regularGrades()
    //         ->whereHas('semester', function ($query) {
    //             $query->where('semester_number', 2);
    //         });
    // }

    // public function generateTwoFactorCode(): void
    // {
    //     $this->timestamps = false;
    //     $this->two_factor_code = rand(100000, 999999);
    //     $this->two_factor_expires = now()->addMinutes(10);
    //     $this->save();
    // }

}
