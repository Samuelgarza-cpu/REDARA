<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Roles extends Model
{

    // public $timestamps = false;
    protected $fillable = [
        'role_name'
    ];

    protected $hidden = ['created_at', 'updated_at'];
}
