<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CashboxEntry extends Model
{
    protected $fillable = [
        'operation',
        'method',
        'amount',
        'is_income',
        'patient_id',
    ];

    protected $casts = [
        'is_income' => 'boolean',
    ];
}
