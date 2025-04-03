<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Maatwebsite\Excel\Excel;

class Staff extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'position', 'department', 'role', 'department_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function department()
{
    return $this->belongsTo(Department::class);
}
}
