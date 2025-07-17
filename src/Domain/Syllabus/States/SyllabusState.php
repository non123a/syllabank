<?php

namespace Domain\Syllabus\States;

use Spatie\ModelStates\Attributes\AllowTransition;
use Spatie\ModelStates\Attributes\DefaultState;
use Spatie\ModelStates\State;

#[
    AllowTransition(Draft::class, SubmitToHeadOfDepartment::class, DraftToSubmitToHeadOfDepartment::class),
    AllowTransition(SubmitToHeadOfDepartment::class, VouchedToDean::class, SubmitToHeadOfDepartmentToVouchedToDean::class),
    AllowTransition(VouchedToDean::class, AcceptedByProvost::class, VouchedToDeanToAcceptedByProvost::class),
    AllowTransition(AcceptedByProvost::class, Approved::class, AcceptedByProvostToApproved::class),
    AllowTransition(SubmitToHeadOfDepartment::class, Draft::class, SubmitToHeadOfDepartmentToDraft::class),
    AllowTransition(VouchedToDean::class, Draft::class, VouchedToDeanToDraft::class),
    AllowTransition(SubmitToHeadOfDepartment::class, Rejected::class, SubmitToHeadOfDepartmentToRejected::class),
    AllowTransition(VouchedToDean::class, Rejected::class, VouchedToDeanToRejected::class),
    AllowTransition(AcceptedByProvost::class, Rejected::class, AcceptedByProvostToRejected::class),
    DefaultState(Draft::class),
]
abstract class SyllabusState extends State
{
    public const REJECTED = 'rejected';
    public const DRAFT = 'draft';
    public const SUBMIT_TO_HEAD_OF_DEPARTMENT = 'submit_to_head_of_department';
    public const VOUCHED_TO_DEAN = 'vouched_to_dean';
    public const ACCEPTED_BY_PROVOST = 'accepted_by_provost';
    public const APPROVED = 'approved';
}
