<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatientDocument extends Model
{
    protected $fillable = [
        'patient_id',
        'name',
        'type',
        'url',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
