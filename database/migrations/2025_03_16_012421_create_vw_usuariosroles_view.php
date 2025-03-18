<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("
            CREATE VIEW vw_usuariosroles AS
            SELECT 
                u.id AS id,
                u.name AS name,
                u.address AS address,
                u.voter_code AS voter_code,
                u.curp AS curp,
                u.registration_year AS registration_year,
                u.date_of_birth AS date_of_birth,
                u.section AS section,
                u.validity AS validity,
                u.id_user_register AS id_user_register,
                u.email AS email,
                r.role_name AS role_name
            FROM users u
            JOIN roles r ON u.id_rol = r.id
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS vw_usuariosroles");
    }
};
