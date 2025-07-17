<?php

namespace App\Management\Controllers;

use App\Http\Controllers\Controller;
use Domain\Class\Actions\ApproveAGradeApprovalRequest;
use Domain\Class\Actions\DeclineAGradeApprovalRequest;
use Domain\Class\Actions\QueryGradeApprovalRequests;
use Domain\Class\Actions\RetrieveGradeApprovalRequestById;
use Domain\Class\DataTransferObjects\RetrieveGradeApprovalRequestData;


class GradeApprovalRequestController extends Controller
{
    public function indexQueryFilterGradeApprovalRequest(QueryGradeApprovalRequests $queryGradeApprovalRequests)
    {
        return $queryGradeApprovalRequests->execute();
    }

    public function approveAGradeApprovalRequest($id, ApproveAGradeApprovalRequest $approveAGradeApprovalRequest)
    {
        $approveAGradeApprovalRequest->execute($id);

        return response()->json([]);
    }

    public function declineAGradeApprovalRequest($id, DeclineAGradeApprovalRequest $declineAGradeApprovalRequest)
    {
        $declineAGradeApprovalRequest->execute($id);

        return response()->json([]);
    }

    public function showGradeApprovalRequest(RetrieveGradeApprovalRequestData $data, RetrieveGradeApprovalRequestById $retrieveGradeApprovalRequestById)
    {
        return response()->json($retrieveGradeApprovalRequestById->execute($data));
    }
}


