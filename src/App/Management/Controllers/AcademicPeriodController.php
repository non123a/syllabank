<?php

namespace App\Management\Controllers;

use App\Http\Controllers\Controller;
use App\Management\Resources\AcademicYearResource;
use Domain\AcademicPeriod\Actions\CreateAcademicYearWithSemesters;
use Domain\AcademicPeriod\Actions\QueryAcademicPeriods;
use Domain\AcademicPeriod\DataTransferObjects\CreateAcademicYearWithSemestersData;
use Illuminate\Http\Request;

class AcademicPeriodController extends Controller
{
    public function indexFilerAcademicPeriods(QueryAcademicPeriods $queryAcademicPeriods)
    {
        return $queryAcademicPeriods->execute();
    }

    public function storeAcademicYearWithSemesters(
        CreateAcademicYearWithSemestersData $data,
        CreateAcademicYearWithSemesters $createAcademicYearWithSemesters
    ) {
        return AcademicYearResource::from($createAcademicYearWithSemesters->execute($data));
    }

    public function show($id)
    {
        //
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
