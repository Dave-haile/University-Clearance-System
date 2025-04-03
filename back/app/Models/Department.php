<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;
    
    protected $fillable = ['department', 'college'];

    public function staff()
    {
        return $this->hasMany(Staff::class);
    }
}
