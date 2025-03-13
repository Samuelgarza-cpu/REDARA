<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserRoleRegisters extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $UserRole = [
            ['id_role_user' => 2, 'id_role_assigned' => 3],
            ['id_role_user' => 3, 'id_role_assigned' => 4],
            ['id_role_user' => 4, 'id_role_assigned' => 5],
            ['id_role_user' => 5, 'id_role_assigned' => 6],
            ['id_role_user' => 6, 'id_role_assigned' => 7],

        ];

        DB::table('user_role_registers')->insert($UserRole);
    }
}
