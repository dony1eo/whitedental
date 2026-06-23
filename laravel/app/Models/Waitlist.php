<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Waitlist extends Model
{
    protected $table = 'waitlist';

    protected $fillable = [
        'patient_name',
        'phone',
        'desired_doctor',
        'date_window',
        'priority',
    ];
}
