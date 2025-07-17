<?php

namespace Domain\School\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\ModelStates\HasStates;

class Faculty extends Model
{
    use HasFactory,
        HasStates,
        \Znck\Eloquent\Traits\BelongsToThrough,
        \Staudenmeir\EloquentHasManyDeep\HasRelationships;


    protected $fillable = [
        'code_name',
        'full_name',
        'description',
        'is_active'
    ];

    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }
}
