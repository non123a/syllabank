<?php

namespace App\Management\Controllers;

use App\Auth\Resources\MeResource;
use App\Http\Controllers\Controller;
use App\Management\Resources\MeScheduleResource;
use App\Management\Resources\SyllabusResource;
use Domain\AcademicPeriod\Actions\QueryMyAcademicPeriod;
use Domain\Class\Actions\QueryAClassSectionStudentsOfMine;
use Domain\Class\Actions\QueryMyClassSections;
use Domain\Class\Actions\QueryMySectionsGradeSubmission;
use Domain\Class\Actions\SubmitMyAGradeApprovalRequest;
use Domain\Class\Actions\UpdateAGradeSubmissionGrades;
use Domain\Class\Actions\UpdateASummerGradeSubmissionGrade;
use Domain\Class\DataTransferObjects\UpdateAGradeSubmissionGradesData;
use Domain\Class\DataTransferObjects\UpdateASummerGradeSubmissionGradeData;
use Domain\Syllabus\Actions\QueryMySyllabi;
use Domain\User\Actions\ListInstructorSchedules;
use Domain\User\Actions\ListStudentSchedules;
use Domain\User\Actions\QueryMyGradeSummary;
use Domain\User\DataTransferObjects\ListInstructorSchedulesData;
use Domain\User\Models\User;
use Illuminate\Http\Request;

class MyController extends Controller
{
    public function me()
    {
        return MeResource::from(request()->user());
    }

    public function indexFilterQueryMySyllabi(Request $request, QueryMySyllabi $queryMySyllabi)
    {
        $user = auth()->user()->id;
        $syllabi = $queryMySyllabi->execute($user);
        return SyllabusResource::collection($syllabi);
    }

    public function listMySchedules(Request $request, ListStudentSchedules $listStudentSchedules, ListInstructorSchedules $listInstructorSchedules)
    {
        if ($request->user()->hasRole('student')) {
            return MeScheduleResource::collect(
                $listStudentSchedules
                    ->execute($request->user()->id)
            );
        }

        if ($request->user()->hasRole('instructor')) {
            $data = ListInstructorSchedulesData::from($request);
            return MeScheduleResource::collect(
                $listInstructorSchedules
                    ->execute($request->user()->id, $data)
            );
        }
    }

    public function indexQueryMyAcademicPeriods(QueryMyAcademicPeriod $queryMyAcademicPeriod)
    {
        return response()->json($queryMyAcademicPeriod->execute());
    }

    public function indexQueryMyClassSections(QueryMyClassSections $queryMyClassSections)
    {
        return response()->json($queryMyClassSections->execute());
    }

    public function indexQueryAClassSectionStudentsOfMine($id, QueryAClassSectionStudentsOfMine $queryAClassSectionStudentsOfMine)
    {
        return response()->json($queryAClassSectionStudentsOfMine->execute($id));
    }

    public function indexQueryMySectionsGradeSubmission(QueryMySectionsGradeSubmission $queryMySectionsGradeSubmission)
    {
        return response()->json($queryMySectionsGradeSubmission->execute());
    }

    public function updateAGradeSubmissionGrades($id, UpdateAGradeSubmissionGradesData $data, UpdateAGradeSubmissionGrades $updateAGradeSubmissionGrades)
    {
        return response()->json($updateAGradeSubmissionGrades->execute($id, $data));
    }

    public function updateASummerGradeSubmissionGrade(UpdateASummerGradeSubmissionGradeData $data, UpdateASummerGradeSubmissionGrade $updateASummerGradeSubmissionGrade)
    {
        return response()->json($updateASummerGradeSubmissionGrade->execute($data));
    }

    public function submitMyAGradeApprovalRequest($id, SubmitMyAGradeApprovalRequest $submitMyAGradeApprovalRequest)
    {
        return response()->json($submitMyAGradeApprovalRequest->execute($id));
    }

    public function indexMyGradeRecords(QueryMyGradeSummary $queryMyGradeSummary)
    {
        return response()->json($queryMyGradeSummary->execute());
    }
}