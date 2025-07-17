<?php

namespace App\Management\Controllers;

use App\Http\Controllers\Controller;
use Domain\Rbac\Actions\AddPermissionsToRole;
use Domain\Rbac\Actions\AssignPermissionsToRole;
use Domain\Rbac\Actions\CreateNewRoleWithPermissions;
use Domain\Rbac\Actions\ListAllPermissions;
use Domain\Rbac\Actions\ListAllRoles;
use Domain\Rbac\Actions\RemovePermissionsFromRole;
use Domain\Rbac\DataTransferObjects\AddPermissionsToRoleData;
use Domain\Rbac\DataTransferObjects\AssignPermissionsToRoleData;
use Domain\Rbac\DataTransferObjects\CreateNewRoleWithPermissionsData;
use Domain\Rbac\DataTransferObjects\RemovePermissionsFromRoleData;

class RbacController extends Controller
{
    public function indexPermissions(ListAllPermissions $listAllPermissions)
    {
        return response()->json($listAllPermissions->execute());
    }

    public function indexRoles(ListAllRoles $listAllRoles)
    {
        return response()->json($listAllRoles->execute());
    }

    public function storeRoleWithPermissions(
        CreateNewRoleWithPermissionsData $data,
        CreateNewRoleWithPermissions $createNewRoleWithPermissions
    ) {
        $createNewRoleWithPermissions->execute($data);
    }

    public function patchPermissionsToRole(
        AssignPermissionsToRoleData $data,
        AssignPermissionsToRole $assignPermissionsToRole
    ) {
        $assignPermissionsToRole->execute($data);
    }

    public function putPermissionsToRole(
        AddPermissionsToRoleData $data,
        AddPermissionsToRole $addPermissionsToRole
    ) {
        $addPermissionsToRole->execute($data);
    }

    public function show($id)
    {
    }

    public function deletePermissionsFromRole(
        RemovePermissionsFromRoleData $data,
        RemovePermissionsFromRole $removePermissionsFromRole
    ) {
        $removePermissionsFromRole->execute($data);
    }

    public function destroy($id)
    {
    }
}
