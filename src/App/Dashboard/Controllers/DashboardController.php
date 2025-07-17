<?php

namespace App\Dashboard\Controllers;

use App\Http\Controllers\Controller;
use Domain\User\Actions\QueryDashboardStudentsRegisteredPassedFailedStatistics;
use Domain\User\Actions\QueryStudentsLevelAllocation;
use Domain\User\Actions\QueryStudentsRegisteredPassedFailedCounts;

class DashboardController extends Controller
{
    public function queryStudentsRegisteredPassedFailedCounts(QueryStudentsRegisteredPassedFailedCounts $queryStudentsRegisteredPassedFailedCounts)
    {
        return $queryStudentsRegisteredPassedFailedCounts->execute();
    }

    public function queryDashboardStudentsRegisteredPassedFailedStatistics(QueryDashboardStudentsRegisteredPassedFailedStatistics $queryDashboardStudentsRegisteredPassedFailedStatistics)
    {
        return $queryDashboardStudentsRegisteredPassedFailedStatistics->execute();
    }

    public function queryStudentsLevelAllocation(QueryStudentsLevelAllocation $queryStudentsLevelAllocation)
    {
        return $queryStudentsLevelAllocation->execute();
    }
}
