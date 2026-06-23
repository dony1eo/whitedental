<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatientGroup extends Model
{
    protected $fillable = [
        'name',
        'condition',
        'color',
        'count',
    ];
}
