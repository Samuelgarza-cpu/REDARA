<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsuarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'name' => 'BEEVRA NAME',
            'address' => 'BEEVRA ADDRESS',
            'voter_code' => 'xxxxxxxxxxxxxxxxxx',
            'curp' => 'xxxxxxxxxxxxxxxxxx',
            'registration_year' => 2025,
            'date_of_birth' => '1990-01-01',
            'section' => '001',
            'validity' => '2030',
            'id_rol' => 1,
            'id_user_register' => 0,
            'email' => 'control@beevra.com',
            'password' => Hash::make('123456789'), // Contraseña encriptada
        ]);
    }
}
