<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'title',
        'assignee_id',
        'priority',
        'due',
        'done',
    ];

    protected $casts = [
        'done' => 'boolean',
    ];

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }
}
