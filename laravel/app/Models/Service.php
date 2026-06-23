<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'name',
        'category',
        'price',
        'doctor_pct',
        'duration',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function treatmentLines()
    {
        return $this->hasMany(TreatmentLine::class);
    }

    public function planItems()
    {
        return $this->hasMany(TreatmentPlanItem::class);
    }
}
