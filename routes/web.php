<?php

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
    Route::get('registro', function () {
        return Inertia::render('registroUsers');
    })->name('registro.users');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
