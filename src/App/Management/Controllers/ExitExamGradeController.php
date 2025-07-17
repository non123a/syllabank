<?php

namespace App\Management\Controllers;

use App\Http\Controllers\Controller;
use Domain\Class\Actions\CreateExitExamGradeForStudent;
use Domain\Class\Actions\QueryExitExamGrades;
use Domain\Class\Actions\UpdateExitExamGradeForStudent;
use Domain\Class\DataTransferObjects\CreateExitExamGradeForStudentData;
use Domain\Class\DataTransferObjects\UpdateExitExamGradeForStudentData;

class ExitExamGradeController extends Controller
{
    public function indexQueryFilterExitExamGrades(QueryExitExamGrades $queryExitExam)
    {
        return $queryExitExam->execute();
    }

    public function storeExitExamGrade(CreateExitExamGradeForStudentData $data, CreateExitExamGradeForStudent $createExitExamGradeForStudent)
    {
        $createExitExamGradeForStudent->execute($data);
    }

    public function updateExitExamGrade(UpdateExitExamGradeForStudentData $data, UpdateExitExamGradeForStudent $updateExitExamGradeForStudent)
    {
        $updateExitExamGradeForStudent->execute($data);
    }
}
