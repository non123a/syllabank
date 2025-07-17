<?php

namespace Domain\Syllabus\Actions;

use Domain\Syllabus\Models\SyllabusRequestForm;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Support\Facades\Auth;

class QueryMySyllabusReqeustForm
{
    public function execute()
    {
        $user = Auth::user();

        $query = QueryBuilder::for(SyllabusRequestForm::class);

        if ($user->hasRole('student')) {
            $query->where('student_id', $user->id);
        } elseif ($user->hasRole('hod')) {
            $query->where('head_of_dept_id', $user->id)
                ->where('status', 'pending');
        }

        return $query
            ->allowedFilters([
                AllowedFilter::exact('status'),
            ])
            ->allowedSorts(['created_at', 'status'])
            ->defaultSort('-created_at')
            ->with(['requester', 'approver', 'academicYear', 'semester'])
            ->jsonPaginate();
    }
}
