<?php

namespace App\Management\Controllers;

use App\Http\Controllers\Controller;
use Domain\School\Actions\CreateFaculty;
use Domain\School\Actions\DisableAFaculty;
use Domain\School\Actions\EnableAFaculty;
use Domain\School\Actions\ListFaculties;
use Domain\School\Actions\QueryFaculties;
use Domain\School\Actions\RetrieveFacultyById;
use Domain\School\Actions\UpdateFaculty;
use Domain\School\Actions\AssignFacultyDean;
use Domain\School\DataTransferObjects\CreateFacultyData;
use Domain\School\DataTransferObjects\DisableAFacultyData;
use Domain\School\DataTransferObjects\EnableAFacultyData;
use Domain\School\DataTransferObjects\UpdateFacultyData;
use Domain\School\DataTransferObjects\AssignFacultyDeanData;
use Domain\School\Models\Faculty;
use Illuminate\Http\Request;

class FacultyController extends Controller
{
    public function indexQueryFilter(QueryFaculties $queryFaculties)
    {
        return $queryFaculties->execute();
    }

    public function store(Request $request, CreateFaculty $createFaculty)
    {
        $data = CreateFacultyData::from($request->all());
        $result = $createFaculty->execute($data);

        return response()->json($result, 201);
    }

    public function show($id)
    {
        return Faculty::findOrFail($id);
    }

    public function update(UpdateFacultyData $data, UpdateFaculty $updateFaculty)
    {
        $updateFaculty->execute($data);

        return response()->noContent();
    }

    public function destroy($id)
    {
        // Implement faculty deletion logic if needed
        return response()->noContent(204);
    }

    public function disable(DisableAFacultyData $data, DisableAFaculty $disableAFaculty)
    {
        $disableAFaculty->execute($data);

        return response()->noContent(200);
    }

    public function enable(EnableAFacultyData $data, EnableAFaculty $enableAFaculty)
    {
        $enableAFaculty->execute($data);

        return response()->noContent(200);
    }

    public function assignDean($id, AssignFacultyDeanData $data, AssignFacultyDean $assignFacultyDean)
    {
        $assignFacultyDean->execute($id, $data);

        return response()->noContent(200);
    }
}
