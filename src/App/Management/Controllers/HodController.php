<?php

namespace App\Management\Controllers;

use App\Http\Controllers\Controller;
use Domain\User\Actions\ListHod;
use Domain\User\Actions\QueryHod;
use Domain\User\Actions\RegisterHod;
use Domain\User\Actions\RetrieveHodById;
use Domain\User\Actions\UpdateHod;
use Domain\User\DataTransferObjects\RegisterHodData;
use Domain\User\DataTransferObjects\UpdateHodData;

class HodController extends Controller
{
    public function indexQueryHod(QueryHods $queryInstructors)
    {
        return $queryHod->execute();
    }

    public function indexListHod(ListHod $listHods)
    {
        return $listHod->execute();
    }

    public function storeHod(RegisterInstructorData $data, RegisterInstructor $registerInstructor)
    {
        $registerHod->excecute($data);
    }

    public function showHod($id, RetrieveInstructorById $retrieveInstructorById)
    {
        return $retrieveHodById->execute($id);
    }

    public function updateHod(UpdateInstructorData $data, UpdateInstructor $updateInstructor)
    {
        $updateHod->execute($data);

        return response()->noContent();
    }

    public function destroy()
    {
    }
}
