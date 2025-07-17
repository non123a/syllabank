<?php

namespace Domain\Syllabus\Models;

use Domain\Course\Actions\CourseAssignment;
use Domain\Course\Models\Course;
use Domain\Syllabus\States\SyllabusState;
use Domain\User\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Ismaelw\LaraTeX\LaraTeX;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\ModelStates\HasStates;

class Syllabus extends Model
{
    use HasFactory,
        HasStates,
        \Znck\Eloquent\Traits\BelongsToThrough,
        \Staudenmeir\EloquentHasManyDeep\HasRelationships;


    protected $table = 'syllabi';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'syllabus_name',
        'content',
        'sections',
        'pdf_base64',
        'credits',
        'is_active',
        'author_id',
        'course_id',
        'status_timeline',
        'is_file_upload',
        'receiver_id',
        'academic_year_id',
        'academic_year_start',
        'academic_year_end',
        'semester_number',
        'last_modified_by',
        'course_assignment_id',
        'credit'
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
        'status' => SyllabusState::class,
        'status_timeline' => 'array',
        'sections' => 'array',
        'credits' => 'integer',
        'is_active' => 'boolean',
        'course_id' => 'integer',
    ];

    public function compileContent($to, $template = 'syllabi.primary')
    {
        $tex = new LaraTeX($template);

        $tex->with([
            'content' => $this->content
        ]);

        if ($to === 'tex') {
            return $tex;
        }

        if ($to === 'pdf') {

            $filename = $this->syllabus_name . uniqid() . '.pdf';

            $tempPath = Storage::disk('local')->pathinfo('temp/' . $filename);

            $tex->savePdf($tempPath);

            return $tempPath;
        }

        throw new \Exception('Unsupported format');
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function courseAssignment()
    {
        return $this->belongsTo(CourseAssignment::class, 'course_assignment_id');
    }
}
