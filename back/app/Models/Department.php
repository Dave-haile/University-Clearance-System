<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $fillable = ['department', 'college'];

    public function departmentHead()
    {
        return $this->hasOne(Staff::class)->where('role', 'department_head');
    }
    public function students()
    {
        return $this->hasMany(Student::class);
    }
    public function clearanceRequests()
    {
        return $this->hasMany(ClearanceRequest::class);
    }
}
