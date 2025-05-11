<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'student_id', 'department_id', 'year'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function clearance_requests(){
        return $this->hasone(ClearanceRequest::class,'student_id','student_id');
    }
    public function department()
    {
        return $this->belongsTo(Department::class);
    }
    
}
