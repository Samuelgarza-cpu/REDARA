<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\RegistroUsersController;
use App\Http\Controllers\VoterController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // return Inertia::render('welcome');
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);
    Route::get('registro', [RegistroUsersController::class, 'index'])->name('registro');
    Route::get('tabla-registros', [RegistroUsersController::class, 'table'])->name('tablaregistros');
    Route::get('asistencia', [RegistroUsersController::class, 'indexAsistencia'])->name('asistencia');
    Route::get('usuarios', [RegistroUsersController::class, 'getAllUsers'])->name('usuarios');

    Route::post('/verificar-voter-code', [VoterController::class, 'verificarVoterCode'])->name('verificar.voter_code');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
