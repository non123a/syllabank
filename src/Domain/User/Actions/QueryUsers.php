<?php

namespace Domain\User\Actions;

use Domain\User\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class QueryUsers
{
    public function execute()
    {
        return QueryBuilder::for(User::class)
            ->with(['roles', 'department', 'department.faculty'])
            ->whereDoesntHave('roles', function (Builder $query) {
                $query->where('name', 'super-admin');
            })
            ->allowedFilters([
                AllowedFilter::exact('is_active'),
                AllowedFilter::callback('department', function (Builder $query, $value) {
                    $query->whereHas('department', function (Builder $deptQuery) use ($value) {
                        $deptQuery->where('code_name', $value);
                    });
                }),
                AllowedFilter::callback('faculty', function (Builder $query, $value) {
                    $query->whereHas('department.faculty', function (Builder $facultyQuery) use ($value) {
                        $facultyQuery->where('code_name', $value);
                    });
                }),
                AllowedFilter::callback('search', function (Builder $query, $value) {
                    $query->where(function (Builder $q) use ($value) {
                        $q->where('name', 'ilike', "%{$value}%")
                            ->orWhere('email', 'like', "%{$value}%")
                            ->orWhere('identification_number', 'like', "%{$value}%")
                            ->orWhereHas('department', function (Builder $deptQuery) use ($value) {
                                $deptQuery->where('code_name', 'ilike', "%{$value}%")
                                    ->orWhere('full_name', 'ilike', "%{$value}%");
                            })
                            ->orWhereHas('department.faculty', function (Builder $facultyQuery) use ($value) {
                                $facultyQuery->where('code_name', 'ilike', "%{$value}%")
                                    ->orWhere('full_name', 'ilike', "%{$value}%");
                            });
                    });
                }),
                AllowedFilter::callback('role', function (Builder $query, $value) {
                    $query->whereHas('roles', function (Builder $roleQuery) use ($value) {
                        $roleQuery->where('name', 'ilike', "%{$value}%");
                    });
                }),
            ])
            ->jsonPaginate();
    }
}
