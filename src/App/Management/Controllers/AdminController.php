<?php

namespace App\Management\Controllers;

use App\Http\Controllers\Controller;
use Domain\User\Actions\DeleteAnAdmin;
use Domain\User\Actions\DisableAnAdmin;
use Domain\User\Actions\EnableAnAdmin;
use Domain\User\Actions\QueryAdmins;
use Domain\User\Actions\RegisterAdmin;
use Domain\User\Actions\RetrieveAdminById;
use Domain\User\Actions\UpdateAdmin;
use Domain\User\DataTransferObjects\DeleteAnAdminData;
use Domain\User\DataTransferObjects\DisableAnAdminData;
use Domain\User\DataTransferObjects\EnableAnAdminData;
use Domain\User\DataTransferObjects\RegisterAdminData;
use Domain\User\DataTransferObjects\RetrieveAdminByIdData;
use Domain\User\DataTransferObjects\UpdateAdminData;

class AdminController extends Controller
{
    public function indexQueryFilterAdmins(QueryAdmins $queryAdmins)
    {
        return $queryAdmins->execute();
    }

    public function storeAdmin(RegisterAdminData $data, RegisterAdmin $registerAdmin)
    {
        return $registerAdmin->excecute($data);
    }

    public function showAdmin(RetrieveAdminByIdData $data, RetrieveAdminById $retrieveAdminById)
    {
        return $retrieveAdminById->execute($data);
    }

    public function updateAdmin(UpdateAdminData $data, UpdateAdmin $updateAdmin)
    {
        return $updateAdmin->execute($data);
    }

    public function deleteAdmin(DeleteAnAdminData $data, DeleteAnAdmin $deleteAnAdmin)
    {
        return $deleteAnAdmin->execute($data);
    }

    public function enableAdmin(EnableAnAdminData $data, EnableAnAdmin $enableAnAdmin)
    {
        return $enableAnAdmin->execute($data);
    }

    public function disableAdmin(DisableAnAdminData $data, DisableAnAdmin $disableAdmin)
    {
        return $disableAdmin->execute($data);
    }
}
