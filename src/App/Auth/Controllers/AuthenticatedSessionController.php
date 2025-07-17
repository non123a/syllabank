<?php

namespace App\Auth\Controllers;

use App\Http\Controllers\Controller;
use Domain\Auth\Actions\AuthenticateUserSession;
use Domain\Auth\DataTransferObjects\SignInData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    public function store(SignInData $signInData, AuthenticateUserSession $authenticateUserSession)
    {
        $authenticateUserSession->execute($signInData);

        return response()->json(auth()->user());
    }

    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
