<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TreatmentPlanItem extends Model
{
    protected $fillable = [
        'plan_id',
        'service_id',
        'tooth_no',
        'status',
        'price',
    ];

    public function plan()
    {
        return $this->belongsTo(TreatmentPlan::class, 'plan_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
