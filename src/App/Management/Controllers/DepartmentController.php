<?php

namespace App\Management\Controllers;

use App\Management\Resources\DepartmentResource;
use Domain\School\Actions\CreateDepartment;
use Domain\School\Actions\DisableADepartment;
use Domain\School\Actions\EnableADepartment;
use Domain\School\Actions\ListDepartments;
use Domain\School\Actions\QueryDepartments;
use Domain\School\Actions\RetrieveDepartmentById;
use Domain\School\Actions\UpdateDepartment;
use Domain\School\Actions\AssignHeadOfDepartment;
use Domain\School\DataTransferObjects\CreateDepartmentData;
use Domain\School\DataTransferObjects\DisableADepartmentData;
use Domain\School\DataTransferObjects\EnableADepartmentData;
use Domain\School\DataTransferObjects\UpdateDepartmentData;
use Domain\School\DataTransferObjects\AssignDepartmentHeadOfDepartmentData;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Domain\School\Actions\AssignAHeadOfDepartment;
use Domain\School\Actions\CreateDepartments;
use Domain\School\DataTransferObjects\AssignAHeadOfDepartmentData;
use Domain\School\DataTransferObjects\CreateDepartmentsData;
use Domain\School\Models\Department;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class DepartmentController extends Controller
{

    public function indexQueryFilter(QueryDepartments $queryDepartments)
    {
        return $queryDepartments->execute();
    }

    public function storeDepartment(CreateDepartmentData $data, CreateDepartment $createDepartment)
    {
        if (!$departmentCreated = $createDepartment->execute($data)) {
            throw new UnprocessableEntityHttpException('Department cannot be created');
        }

        return response()->json($departmentCreated, 201);
    }

    public function showDepartment($id)
    {
        return Department::findOrFail($id);
    }

    public function updateDepartment(UpdateDepartmentData $data, UpdateDepartment $updateDepartment)
    {
        $updateDepartment->execute($data);

        return response()->noContent();
    }

    public function disableADepartment(DisableADepartmentData $data, DisableADepartment $disableADepartment)
    {
        $disableADepartment->execute($data);

        return response()->noContent(200);
    }

    public function enableADepartment(EnableADepartmentData $data, EnableADepartment $enableADepartment)
    {
        $enableADepartment->execute($data);

        return response()->noContent(200);
    }

    public function assignHoD($id, AssignAHeadOfDepartmentData $data, AssignAHeadOfDepartment $assignAHeadOfDepartment)
    {
        $assignAHeadOfDepartment->execute($data);

        return response()->noContent(200);
    }

    public function updateHoD($id, UpdateHoDData $data, UpdateHoD $updateHoD)
    {
        $updateHoD->execute($id, $data);

        return response()->noContent(200);
    }
}
