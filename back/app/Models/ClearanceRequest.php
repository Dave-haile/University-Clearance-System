<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClearanceRequest extends Model
{
    use HasFactory;
    protected $fillable = [
        'student_id',
        'department_id',
        'year',
        'status',
        'comment',
        'semester',
        'section',
        'academic_year',
        'last_day_class_attended',
        'reason_for_clearance',
        'cafe_status',
        'dorm_status',
        'department_head_approved',
        'library_approved',
        'cafeteria_approved',
        'proctor_approved',
        'registrar_approved',
        'current_step',
        'sex',
        'approvals'

    ];
    protected $casts = [
        'approvals' => 'array'
    ];
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }
    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
