<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DentalTooth extends Model
{
    protected $fillable = [
        'patient_id',
        'tooth_no',
        'status',
        'notes',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
