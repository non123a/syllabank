<?php

use App\Auth\Controllers\AuthenticatedSessionController;
use App\Auth\Controllers\ChangePasswordController;
use App\Auth\Controllers\NewPasswordController;
use App\Auth\Controllers\PasswordResetLinkController;
use App\Auth\Controllers\SetPasswordController;
use App\Auth\Controllers\RegisterUserController;
use App\Management\Controllers\SyllabusController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Http\Controllers\TwoFactorAuthenticatedSessionController;
use setasign\Fpdi\Tcpdf\Fpdi;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});



Route::prefix('auth')
    ->group(function () {
        Route::post('/register', [RegisterUserController::class, 'register'])
            ->middleware('guest')
            ->name('register');

        Route::post('/login', [AuthenticatedSessionController::class, 'store'])
            ->name('login');

        Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
            ->middleware('guest')
            ->name('password.email');

        Route::post('/reset-password', [NewPasswordController::class, 'store'])
            ->middleware('guest')
            ->name('password.update');

        Route::put('/change-password', [ChangePasswordController::class, 'update'])
            ->middleware(['auth:sanctum'])
            ->name('change-password');

        Route::put('/set-password', [SetPasswordController::class, 'update'])
            ->middleware('guest')
            ->name('set-password');

        Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
            ->middleware('auth:sanctum')
            ->name('logout');
    });
