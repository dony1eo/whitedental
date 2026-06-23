<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $fillable = [
        'name',
        'contact',
        'phone',
        'category',
        'balance',
    ];

    public function materials()
    {
        return $this->hasMany(Material::class);
    }

    public function warehouseDocs()
    {
        return $this->hasMany(WarehouseDoc::class);
    }
}
