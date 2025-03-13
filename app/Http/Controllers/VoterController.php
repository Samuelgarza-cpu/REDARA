<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class VoterController extends Controller
{
    public function verificarVoterCode(Request $request)
    {
        $codigo = $request->input('voter_code');

        // Verifica si el código de elector existe en la base de datos
        $existe = User::where('voter_code', $codigo)->exists();

        return response()->json(['existe' => $existe]);
    }
}
