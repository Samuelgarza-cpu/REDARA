<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ViewUsers extends Model
{
    protected $table = 'vw_usuariosroles'; // Hace referencia a la vista en MySQL
    public $timestamps = false;
}
