<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WarehouseDoc extends Model
{
    protected $fillable = [
        'doc_no',
        'type',
        'supplier_id',
        'party',
        'status',
        'total_sum',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function lines()
    {
        return $this->hasMany(WarehouseDocLine::class, 'doc_id');
    }
}
