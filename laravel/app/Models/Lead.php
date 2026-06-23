<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'source',
        'stage',
        'potential',
        'curator_id',
        'patient_id',
        'notes',
    ];

    public function curator()
    {
        return $this->belongsTo(User::class, 'curator_id');
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
