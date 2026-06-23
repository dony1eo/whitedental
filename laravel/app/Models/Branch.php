<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    protected $fillable = [
        'name',
        'address',
        'is_main',
    ];

    protected $casts = [
        'is_main' => 'boolean',
    ];
}
