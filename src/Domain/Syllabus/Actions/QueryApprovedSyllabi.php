<?php

namespace Domain\Syllabus\Actions;

use Domain\Syllabus\Models\Syllabus;
use App\Management\Resources\SyllabusResource;
use Domain\School\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class QueryApprovedSyllabi
{
    public function execute(Request $request)
    {
        $user = Auth::user();
        $query = Syllabus::where('status', 'approved')
            ->join('courses_academic_years_semesters_users', DB::raw('CAST(syllabi.course_assignment_id AS BIGINT)'), '=', 'courses_academic_years_semesters_users.id');

        if ($user->hasRole('provost')) {
            // Provost gets access to all approved syllabi
            // No additional filtering needed
        } elseif ($user->hasRole('dean')) {
            $departmentCodeName = $user->department->code_name;
            $department = Department::where('code_name', $departmentCodeName)->first();
            if ($department) {
                $faculty = $department->faculty;
                if ($faculty) {
                    $deanUser = $faculty->dean;
                    if ($deanUser && $deanUser->id === $user->id) {
                        $facultyId = $faculty->id;
                        $query->whereHas('course.department.faculty', function ($q) use ($facultyId) {
                            $q->where('id', $facultyId);
                        });
                    }
                }
            }
        } elseif ($user->hasRole('hod')) {
            $departmentCodeName = $user->department->code_name;
            $query->where('courses_academic_years_semesters_users.department', $departmentCodeName);
        }

        if ($request->has('filter.search')) {
            $search = $request->input('filter.search');
            $query->where(function ($q) use ($search) {
                $q->where('syllabus_name', 'ilike', "%{$search}%")
                    ->orWhereHas('author', function ($q) use ($search) {
                        $q->where('name', 'ilike', "%{$search}%");
                    })
                    ->orWhereHas('course', function ($q) use ($search) {
                        $q->where('course_name', 'ilike', "%{$search}%")
                            ->orWhere('course_subject', 'ilike', "%{$search}%")
                            ->orWhere('course_code', 'ilike', "%{$search}%");
                    });
            });
        }

        $syllabi = $query->select('syllabi.*')->distinct()->jsonPaginate();
        return SyllabusResource::collection($syllabi);
    }
}
