<?php

namespace Domain\Syllabus\Actions;

use Domain\Syllabus\Models\Syllabus;
use Illuminate\Http\Request;
use App\Management\Resources\StudentSyllabiResource;

class QueryFilterApprovedSyllabiForStudent
{
    public function execute(Request $request)
    {
        $query = Syllabus::where('status', 'approved');

        if ($request->has('academic_year_start')) {
            $academicYearStart = $request->input('academic_year_start');
            $query->whereYear('academic_year_start', $academicYearStart);
        }

        if ($request->has('semester_number')) {
            $semesterNumber = $request->input('semester_number');
            $query->where('semester_number', $semesterNumber);
        }

        $syllabi = $query->get();

        return StudentSyllabiResource::collection($syllabi);
    }
}
