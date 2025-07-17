<?php

namespace App\Management\Controllers;

use App\Http\Controllers\Controller;
use App\Management\Resources\AcademicYearResource;
use App\Management\Resources\CreateAcademicYearResource;
use Domain\AcademicPeriod\Actions\CreateAcademicYear;
use Domain\AcademicPeriod\Actions\CreateSemesterForAcademicYear;
use Domain\AcademicPeriod\Actions\DeleteAcademicYear;
use Domain\AcademicPeriod\Actions\DuplicateAcademicYear;
use Domain\AcademicPeriod\Actions\GetAcademicYearById;
use Domain\AcademicPeriod\Actions\ListAcademicYears;
use Domain\AcademicPeriod\Actions\QueryAcademicYears;
use Domain\AcademicPeriod\Actions\QuerySemestersInAcademicYear;
use Domain\AcademicPeriod\Actions\UpdateSemesterForAcademicYear;
use Domain\AcademicPeriod\DataTransferObjects\CreateAcademicYearData;
use Domain\AcademicPeriod\DataTransferObjects\CreateSemesterForAcademicYearData;
use Domain\AcademicPeriod\DataTransferObjects\DuplicateAcademicYearData;
use Domain\AcademicPeriod\DataTransferObjects\GetAcademicYearByIdData;
use Domain\AcademicPeriod\DataTransferObjects\UpdateSemesterForAcademicYearData;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    public function indexAcademicYears(ListAcademicYears $listAcademicYears)
    {
        return response()->json($listAcademicYears->execute());
    }

    public function indexQueryAcademicYears(QueryAcademicYears $queryAcademicYears)
    {
        return response()->json($queryAcademicYears->execute());
    }

    public function storeAcademicYear(
        CreateAcademicYearData $data,
        CreateAcademicYear $createAcademicYear
    ) {
        return CreateAcademicYearResource::fromModel($createAcademicYear->execute($data));
    }

    public function indexQuerySemestersInAcademicYear(QuerySemestersInAcademicYear $querySemestersInAcademicYear, $academicYearId)
    {
        return response()->json($querySemestersInAcademicYear->execute($academicYearId));
    }

    public function storeSemesterForAcademicYear(
        CreateSemesterForAcademicYearData $data,
        CreateSemesterForAcademicYear $createSemesterForAcademicYear
    ) {
        return AcademicYearResource::from($createSemesterForAcademicYear->execute($data));
    }

    public function updateSemesterForAcademicYear(
        UpdateSemesterForAcademicYearData $data,
        UpdateSemesterForAcademicYear $updateSemesterForAcademicYear
    ) {
        return AcademicYearResource::from($updateSemesterForAcademicYear->execute($data));
    }


    public function duplicateAcademicYear(DuplicateAcademicYearData $data, DuplicateAcademicYear $duplicateAcademicYear)
    {
        $duplicateAcademicYear->execute($data);

        return response()->json(['message' => 'Academic year duplicated successfully']);
    }


    public function showAcademicYear(GetAcademicYearByIdData $data, GetAcademicYearById $getAcademicYearById)
    {
        return AcademicYearResource::from($getAcademicYearById->execute($data));
    }

    public function deleteAcademicYear($id, DeleteAcademicYear $deleteAcademicYear)
    {
        $deleteAcademicYear->execute($id);

        return response()->json(['message' => 'Academic year deleted successfully']);
    }

    public function edit($id)
    {
        //
    }

    public function update(Request $request, $id)
    {
        //
    }

    public function destroy($id)
    {
        //
    }
}