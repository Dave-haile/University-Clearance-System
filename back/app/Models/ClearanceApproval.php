<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClearanceApproval extends Model
{
    protected $fillable = [
        'clearance_request_id',
        'status',
        'comment',
        'approved_by',
        'department'
    ];

    public function clearanceRequest()
    {
        return $this->belongsTo(ClearanceRequest::class);
    }
}
