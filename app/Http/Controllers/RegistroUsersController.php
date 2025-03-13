<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Roles;
use App\Models\User;
use App\Models\UserRoleRegister;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use function Laravel\Prompts\search;

class RegistroUsersController extends Controller
{
    public function index()
    {
        $id_rol_user = auth()->user()->id_rol;

        if ($id_rol_user != 1) {
            $serach_id_rol_user_assigned = UserRoleRegister::select('id_role_assigned')->where('id_role_user', $id_rol_user)->get();
            return Inertia::render('registroUsers', [
                'roles' => Roles::whereIn('id', $serach_id_rol_user_assigned)->get() ?? []
            ]);
        } else {

            return Inertia::render('registroUsers', [
                'roles' => Roles::all() ?? []
            ]);
        }
    }

    public function table()
    {
        $idAuth = auth()->id();
        $registrosIdAuth = User::where('id_user_register', $idAuth)->get() ?? [];
        $totalRegistros = count($registrosIdAuth);
        return Inertia::render('tableRegisterUsers', [
            'registeredUsers' => $registrosIdAuth,
            'totalRegistrations' => $totalRegistros
        ]);
    }

    public function indexAsistencia()
    {
        return Inertia::render('asistencia');
    }
}
