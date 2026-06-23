<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TreatmentLine extends Model
{
    protected $fillable = [
        'appointment_id',
        'service_id',
        'doctor_id',
        'tooth_no',
        'qty',
        'price',
        'doctor_pct',
    ];

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }
}
