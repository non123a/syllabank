<?php

namespace App\Management\Controllers;

use Domain\User\DataTransferObjects\RegisterUserData;
use Domain\User\DataTransferObjects\UpdateAUserData;

use App\Http\Controllers\Controller;

use Domain\User\Actions\DisableAUser;
use Domain\User\Actions\EnableAUser;
use Domain\User\Actions\QueryUsers;
use Domain\User\Actions\RegisterUser;
use Domain\User\Actions\RetrieveUserById;

use Domain\User\Actions\UpdateAUser;

use Illuminate\Http\JsonResponse;

use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class UserController extends Controller
{
    public function indexFilterUsers(QueryUsers $queryUsers)
    {
        return $queryUsers->execute();
    }

    public function storeUser(RegisterUserData $data, RegisterUser $registerUser)
    {
        if (!$userCreated = $registerUser->execute($data)) {
            throw new UnprocessableEntityHttpException('User cannot be created');
        }

        return response()->json($userCreated, 201);
    }

    public function showUser($id, RetrieveUserById $retrieveUserById): JsonResponse
    {
        $user = $retrieveUserById->execute($id);

        return response()->json($user);
    }


    public function updateUser(UpdateAUserData $data, UpdateAUser $UpdateAUser)
    {
        $UpdateAUser->execute($data);

        return response()->noContent();
    }

    public function disableAUser($id, DisableAUser $disableAUser)
    {
        $disableAUser->execute($id);

        return response()->noContent();
    }

    public function enableAUser($id, EnableAUser $enableAUser)
    {
        $enableAUser->execute($id);

        return response()->noContent();
    }
}
