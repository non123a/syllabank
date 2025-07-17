<?php

namespace Domain\Syllabus\Actions;

use Domain\Syllabus\Models\Syllabus;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Support\Facades\Auth;
use Domain\User\Models\User;
use Illuminate\Support\Facades\DB;

class QueryMySyllabi
{
    public function execute($user_id)
    {
        $user = request()->user();
        $query = Syllabus::query();

        if ($user->hasRole('hod') || $user->hasRole('dean') || $user->hasRole('provost')) {
            $query->where('receiver_id', $user_id);
        } else {
            $query->whereHas('course', function (Builder $courseQuery) use ($user_id) {
                $courseQuery->whereExists(function ($query) use ($user_id) {
                    $query->select(DB::raw(1))
                        ->from('courses_academic_years_semesters_users')
                        ->whereRaw('courses_academic_years_semesters_users.course_id = courses.id')
                        ->where(function ($q) use ($user_id) {
                            $q->whereRaw("'{$user_id}' = ANY(string_to_array(courses_academic_years_semesters_users.instructor_id, ','))")
                                ->orWhere('courses_academic_years_semesters_users.instructor_id', 'LIKE', "%{$user_id}%");
                        });
                });
            });
        }

        return QueryBuilder::for($query)
            ->allowedFilters([
                AllowedFilter::partial('search', 'syllabus_name'),
                AllowedFilter::exact('status'),
                AllowedFilter::callback('search', function (Builder $query, $value) {
                    $query->where(function (Builder $query) use ($value) {
                        $query->where('syllabus_name', 'ilike', "%{$value}%")
                            ->orWhereHas('course', function (Builder $query) use ($value) {
                                $query->where('course_name', 'ilike', "%{$value}%")
                                    ->orWhere('course_subject', 'ilike', "%{$value}%")
                                    ->orWhere('course_code', 'ilike', "%{$value}%");
                            });
                    });
                })
            ])
            ->defaultSort('-updated_at')
            ->jsonPaginate();
    }
}
