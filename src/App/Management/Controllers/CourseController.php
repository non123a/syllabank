<?php

namespace App\Management\Controllers;

use App\Http\Controllers\Controller;
use App\Management\Resources\CourseResource;
use Domain\Course\Actions\AssignACourseToInstructor;
use Domain\Course\Actions\CreateCourse;
use Domain\Course\Actions\DisableACourse;
use Domain\Course\Actions\EnableACourse;
use Domain\Course\Actions\ListCourses;
use Domain\Course\Actions\QueryCourseAssignments;
use Domain\Course\Actions\QueryCourses;
use Domain\Course\Actions\RegisterCourse;
use Domain\Course\Actions\RetrieveCourseById;
use Domain\Course\Actions\UpdateCourse;
use Domain\Course\DataTransferObjects\AssignACourseToInstructorData;
use Domain\Course\DataTransferObjects\CreateCourseData;
use Domain\Course\DataTransferObjects\DisableACourseData;
use Domain\Course\DataTransferObjects\EnableACourseData;
use Domain\Course\DataTransferObjects\RegisterCourseData;
use Domain\Course\DataTransferObjects\UpdateCourseData;
use Domain\Course\Models\Course;
use Illuminate\Http\Request;
use Domain\Course\Actions\CourseAssignment;
use Domain\Course\DataTransferObjects\CourseAssignmentData;
use Domain\User\Models\User;
use Illuminate\Support\Facades\DB;

class CourseController extends Controller
{
    public function indexFilterCourses(QueryCourses $queryCourses)
    {
        return $queryCourses->execute();
    }

    public function storeCourse(Request $request, CreateCourse $createCourse)
    {
        $data = CreateCourseData::from($request->all());
        $result = $createCourse->execute($data, $request->input('forceContinue', false));

        if ($result['status'] === 'duplicate') {
            return response()->json($result, 409);
        }

        return response()->json($result, 201);
    }

    public function storeCourseAnyway(Request $request, CreateCourse $createCourse)
    {
        $data = CreateCourseData::from($request->all());
        $result = $createCourse->execute($data, $request->input('forceContinue', true));

        return response()->json($result, 201);
    }

    public function showCourse($id, RetrieveCourseById $retrieveCourseById)
    {
        return CourseResource::from($retrieveCourseById->execute($id));
    }

    public function updateCourse($id, UpdateCourseData $data, UpdateCourse $updateCourse)
    {
        $updateCourse->execute($id, $data);

        return response()->noContent(200);
    }

    public function disableACourse(DisableACourseData $data, DisableACourse $disableACourse)
    {
        $disableACourse->execute($data);
    }

    public function enableACourse(EnableACourseData $data, EnableACourse $enableACourse)
    {
        $enableACourse->execute($data);
    }

    public function queryCourseAssignments(QueryCourseAssignments $queryCourseAssignments)
    {
        return $queryCourseAssignments->execute();
    }

    public function assignInstructorToCourse(Request $request, AssignACourseToInstructor $assignACourseToInstructor)
    {
        $data = AssignACourseToInstructorData::from($request->all());
        $assignACourseToInstructor->execute($data);

        return response()->noContent(200);
    }

    public function assignCourseToAcademicPeriod(Request $request, CourseAssignment $courseAssignment)
    {
        $data = CourseAssignmentData::from($request->all());
        $result = $courseAssignment->execute($data);

        if ($result['success']) {
            return response()->json(['message' => $result['message']], 200);
        } else {
            return response()->json(['message' => $result['message']], 400);
        }
    }

    public function assignUserToCourse(Request $request)
    {
        $course = Course::findOrFail($request->input('course_id'));
        $user = User::findOrFail($request->input('user_id'));

        $course->users()->attach($user->id);

        return response()->json(['message' => 'User assigned to course successfully'], 200);
    }

    public function disableACourseAssignment($id)
    {
        try {
            DB::table('courses_academic_years_semesters_users')
                ->where('id', $id)
                ->update(['is_active' => false]);

            return response()->json(['message' => 'Course assignment disabled successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error disabling course assignment'], 500);
        }
    }

    public function enableACourseAssignment($id)
    {
        DB::table('courses_academic_years_semesters_users')
            ->where('id', $id)
            ->update(['is_active' => true]);

        return response()->json(['message' => 'Course assignment enabled successfully'], 200);
    }
}