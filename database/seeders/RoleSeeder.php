<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['role_name' => 'Administrador'],
            ['role_name' => 'Coordinador'],
            ['role_name' => 'Jefe de distrito'],
            ['role_name' => 'Jefe de ruta'],
            ['role_name' => 'Integrante de ruta'],
            ['role_name' => 'Representante de comite'],
            ['role_name' => 'Integrante de comite'],
        ];

        DB::table('roles')->insert($roles);
    }
}
