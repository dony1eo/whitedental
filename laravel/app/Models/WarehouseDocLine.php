<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WarehouseDocLine extends Model
{
    protected $fillable = [
        'doc_id',
        'material_id',
        'qty',
        'price',
    ];

    public function doc()
    {
        return $this->belongsTo(WarehouseDoc::class, 'doc_id');
    }

    public function material()
    {
        return $this->belongsTo(Material::class);
    }
}
