<?php

namespace Domain\School\Models;

use Domain\Course\Models\Course;
use Domain\Syllabus\Models\Syllabus;
use Domain\User\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    use HasFactory,
        \Znck\Eloquent\Traits\BelongsToThrough,
        \Staudenmeir\EloquentHasManyDeep\HasRelationships;



    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['section_name', 'course_id',  'author_id'];

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
    protected $casts = [];

    public function syllabus()
    {
        return $this->hasOneThrough(Syllabus::class, Course::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
