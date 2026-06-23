<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $fillable = [
        'patient_id',
        'doctor_id',
        'chair',
        'visit_type',
        'visit_kind',
        'start_time',
        'end_time',
        'status',
        'direction',
        'source',
        'comment',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function treatmentLines()
    {
        return $this->hasMany(TreatmentLine::class);
    }
}
