<?php

namespace App\Management\Controllers;

use App\Http\Controllers\Controller;
use Domain\User\Actions\ListInstructors;
use Domain\User\Actions\QueryInstructors;
use Domain\User\Actions\RegisterInstructor;
use Domain\User\Actions\RetrieveInstructorById;
use Domain\User\Actions\UpdateInstructor;
use Domain\User\DataTransferObjects\RegisterInstructorData;
use Domain\User\DataTransferObjects\UpdateInstructorData;

class InstructorController extends Controller
{
    public function indexQueryInstructors(QueryInstructors $queryInstructors)
    {
        return $queryInstructors->execute();
    }

    public function indexListInstructors(ListInstructors $listInstructors)
    {
        return $listInstructors->execute();
    }

    public function storeInstructor(RegisterInstructorData $data, RegisterInstructor $registerInstructor)
    {
        $registerInstructor->excecute($data);
    }

    public function showInstructor($id, RetrieveInstructorById $retrieveInstructorById)
    {
        return $retrieveInstructorById->execute($id);
    }

    public function updateInstructor(UpdateInstructorData $data, UpdateInstructor $updateInstructor)
    {
        $updateInstructor->execute($data);

        return response()->noContent();
    }

    public function destroy()
    {
    }
}
