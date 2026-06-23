<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'specialty',
        'phone',
        'color',
        'last_login',
    ];

    protected $casts = [
        'last_login' => 'datetime',
    ];

    protected $hidden = [
        'password',
    ];

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'doctor_id');
    }

    public function treatmentLines()
    {
        return $this->hasManyThrough(TreatmentLine::class, Appointment::class, 'doctor_id', 'appointment_id');
    }

    public function leads()
    {
        return $this->hasMany(Lead::class, 'curator_id');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class, 'assignee_id');
    }
}
