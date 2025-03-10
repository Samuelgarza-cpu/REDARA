<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Roles;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register', [
            'roles' => Roles::all() ?? []
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {



        $idUsuario = auth()->id();

        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            // 'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validación de la imagen

        ]);

        $imagePath = null;
        if ($request->hasFile('photo')) {
            $imagePath = $request->file('photo')->store('users', 'public');
        }

        $user = User::create([
            'name' => $request->name,
            'address' => $request->address,
            'voter_code' => $request->voter_code,
            'curp' => $request->curp,
            'registration_year' => $request->registration_year,
            'date_of_birth' => $request->date_of_birth,
            'section' => $request->section,
            'validity' => $request->validity,
            'id_rol' => $request->id_rol,
            'id_user_register' => $idUsuario,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'photo' => $imagePath,
        ]);

        // event(new Registered($user));

        // Auth::login($user);

        return to_route('tablaregistros');
    }
}
