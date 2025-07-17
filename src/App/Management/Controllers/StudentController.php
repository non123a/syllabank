<?php

namespace App\Management\Controllers;

use App\Http\Controllers\Controller;
use App\Management\Resources\StudentWithAcademicPeriodResource;
use Domain\User\Actions\BulkRegisterStudentsWithSpreadSheet;
use Domain\User\Actions\DisableAStudent;
use Domain\User\Actions\EnableAStudent;
use Domain\User\Actions\ListStudentSchedules;
use Domain\User\Actions\QueryStudents;
use Domain\User\Actions\QueryStudentsGradesSummary;
use Domain\User\Actions\RegisterStudent;
use Domain\User\Actions\RetrieveStudentById;
use Domain\User\Actions\UpdateStudent;
use Domain\User\DataTransferObjects\BulkRegisterStudentsWithSpreadSheetData;
use Domain\User\DataTransferObjects\DisableAStudentData;
use Domain\User\DataTransferObjects\EnableAStudentData;
use Domain\User\DataTransferObjects\RegisterStudentData;
use Domain\User\DataTransferObjects\UpdateStudentData;

class StudentController extends Controller
{
    public function indexFilterStudents(QueryStudents $queryStudents)
    {
        return $queryStudents->execute();
    }

    public function indexQueryStudentsGradeSummary(QueryStudentsGradesSummary $queryStudentsGradesSummary)
    {
      return $queryStudentsGradesSummary->execute();
    }

    public function storeStudentsWithSpreadSheet(
        BulkRegisterStudentsWithSpreadSheetData $data,
        BulkRegisterStudentsWithSpreadSheet $bulkRegisterStudentsWithSpreadSheet
    ) {
        $bulkRegisterStudentsWithSpreadSheet->execute($data);
    }

    public function storeStudent(RegisterStudentData $data, RegisterStudent $registerStudent)
    {
        $registerStudent->excecute($data);
    }

    public function showStudent($id, RetrieveStudentById $retrieveStudentById)
    {
        return StudentWithAcademicPeriodResource::from($retrieveStudentById->execute($id));
    }

    public function listOwnSchedule(ListStudentSchedules $listStudentSchedules)
    {
        return $listStudentSchedules->execute(auth()->id());
    }

    public function updateStudent(UpdateStudentData $data, UpdateStudent $updateStudent)
    {
        $updateStudent->execute($data);

        return response()->noContent();
    }

    public function disableAStudent(DisableAStudentData $data, DisableAStudent $disableAStudent)
    {
        $disableAStudent->execute($data);

        return response()->noContent();
    }

    public function enableAStudent(EnableAStudentData $data, EnableAStudent $enableAStudent)
    {
        $enableAStudent->execute($data);

        return response()->noContent();
    }
}
