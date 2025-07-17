<?php

namespace App\Management\Controllers;

use App\Http\Controllers\Controller;
use Domain\Class\Actions\CreateAClass;
use Domain\Class\Actions\DeleteAClassById;
use Domain\Class\Actions\ListClassesForAcademicPeriod;
use Domain\Class\Actions\QueryClasses;
use Domain\Class\Actions\RetrieveClassById;
use Domain\Class\Actions\UpdateAClass;
use Domain\Class\DataTransferObjects\CreateAClassData;
use Domain\Class\DataTransferObjects\UpdateAClassData;

class ClassController extends Controller
{
    public function indexQueryClasses(QueryClasses $queryClasses)
    {
        return response()->json($queryClasses->execute());
    }

    public function indexQueryClassesWithSectionsForAcademicPeriod()
    {

    }

    public function storeClass(CreateAClassData $data, CreateAClass $createAClass)
    {
        $createAClass->execute($data);
    }

    public function showAClass($id, RetrieveClassById $retrieveClassById)
    {
        return response()->json($retrieveClassById->execute($id));
    }

    public function showClassesForSemester($academicYearId, $academicSemesterId, ListClassesForAcademicPeriod $listClassesForAcademicPeriod)
    {
        return response()->json($listClassesForAcademicPeriod->execute($academicYearId, $academicSemesterId));
    }

    public function editClass($id, UpdateAClassData $data, UpdateAClass $updateAClass)
    {
        $updateAClass->execute($id, $data);

        return response()->noContent(200);
    }

    public function edit()
    {
    }

    public function destroyAClass($id, DeleteAClassById $deleteAClassById)
    {
        $deleteAClassById->execute($id);

        return response()->noContent();
    }

    public function destroy()
    {
    }
}

