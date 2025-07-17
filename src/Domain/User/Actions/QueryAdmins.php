<?php

namespace Domain\User\Actions;

use Domain\User\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class QueryAdmins
{
    public function execute()
    {
        return QueryBuilder::for(User::role('admin'))
            ->allowedFilters([
                AllowedFilter::callback('name,email,identification', function (Builder $query, $value) {
                    $query->where(function (Builder $q) use ($value) {
                        $q->where('name', 'like', "%{$value}%")
                            ->orWhere('email', 'like', "%{$value}%")
                            ->orWhere('identification_number', 'like', "%{$value}%");
                    });
                }),
            ])
            ->jsonPaginate();
    }
}
