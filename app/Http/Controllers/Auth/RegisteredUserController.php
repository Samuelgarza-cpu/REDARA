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
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;
use function Laravel\Prompts\error;

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
        try {
            $currentYear = Carbon::now()->year; // Obtiene el año actual
            $idUsuario = auth()->id();
            $messages = [
                'name.required' => 'El nombre es obligatorio.',
                'name.string' => 'El nombre debe ser una cadena de caracteres.',
                'name.max' => 'El nombre no debe superar los 255 caracteres.',

                'address.required' => 'La dirección es obligatoria.',
                'address.string' => 'La dirección debe ser una cadena de caracteres.',
                'address.max' => 'La dirección no debe superar los 255 caracteres.',

                'voter_code.required' => 'El código de votante es obligatorio.',
                'voter_code.string' => 'El código de votante debe ser una cadena de caracteres.',
                'voter_code.max' => 'El código de votante no debe superar los 20 caracteres.',
                'voter_code.unique' => 'La clave de elector ya está registrada.',

                'curp.required' => 'El CURP es obligatorio.',
                'curp.string' => 'El CURP debe ser una cadena de caracteres.',
                'curp.max' => 'El CURP no debe superar los 18 caracteres.',
                'curp.unique' => 'El CURP ya está registrado.',

                'section.required' => 'El campo de sección es obligatorio.',
                'section.digits' => 'La sección debe contener exactamente 4 dígitos.',

                'validity.required' => 'El campo de vigencia es obligatorio.',
                'validity.numeric' => 'La vigencia debe ser un número.',
                'validity.gte' => 'Tu INE ya esta VENCIDA.',

                'email.required' => 'El correo electrónico es obligatorio.',
                'email.string' => 'El correo electrónico debe ser una cadena de caracteres.',
                'email.lowercase' => 'El correo electrónico debe estar en minúsculas.',
                'email.email' => 'El correo electrónico debe tener un formato válido.',
                'email.max' => 'El correo electrónico no debe superar los 255 caracteres.',
                'email.unique' => 'El correo electrónico ya está registrado.',

                'password.required' => 'La contraseña es obligatoria.',
                'password.confirmed' => 'La confirmación de la contraseña no coincide.',
                'password' => 'La contraseña no es válida.',

                'date_of_birth.date_format_dd_mm_yyyy' => 'El campo fecha de nacimiento debe tener el formato DD/MM/YYYY.',
            ];
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'voter_code' => 'required|string|max:20|unique:users',
                'curp' => 'required|string|max:18|unique:users',
                'date_of_birth' => 'required|date_format_dd_mm_yyyy',
                'section' => 'required|digits:4',
                'validity' => "required|numeric|gte:$currentYear",
                'email' => 'required|string|lowercase|email|max:255|unique:users',
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ], $messages);

            $imagePath = null;
            if ($request->hasFile('photo')) {
                $imagePath = $request->file('photo')->store('users', 'public');
            }

            $user = User::create([
                'name' => $validated['name'],
                'address' => $validated['address'],
                'voter_code' => $validated['voter_code'],
                'curp' => $validated['curp'],
                'registration_year' => $request->registration_year,
                'date_of_birth' => $request->date_of_birth,
                'section' => $request->section,
                'validity' => $request->validity,
                'id_rol' => $request->id_rol,
                'id_user_register' => $idUsuario,
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'photo' => $imagePath,
            ]);

            // Retornar JSON de éxito sin redirigir
            return redirect()->route('tablaregistros');
        } catch (\Exception $e) {
            Log::error('Error en el registro: ' . $e->getMessage());

            // Retornar JSON con error para que Inertia lo capture
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
