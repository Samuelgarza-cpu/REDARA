<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserRoleRegister extends Model
{
    protected $fillable = [
        'id_role_user',
        'id_role_assigned'
    ];
}
