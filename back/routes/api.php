<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClearanceApprovalController;
use App\Http\Controllers\ClearanceRequestController;
use App\Http\Controllers\StaffController;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

Route::post('/create-student', [AuthController::class, 'Signup']);

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/clearance-request', [ClearanceRequestController::class, 'store']);
    Route::get('/student/clearance-requests', [ClearanceRequestController::class, 'show']);
    Route::get('/clearance-requests',[ClearanceRequestController::class, 'index']);
    Route::put('/clearance-approval/{id}', [ClearanceApprovalController::class, 'update']);
    Route::post('/approve-clearance/{id}', [ClearanceRequestController::class, 'approveClearance']);
    Route::get('/departmentDisplay', [StaffController::class, 'show']);
    Route::post('/staffAccountCreation', [StaffController::class, 'store']);
    Route::post('/admin/department',[AdminController::class, 'create']);
});
Route::get('/Allclearance-requsets',[ClearanceRequestController::class, 'display']);
Route::post('/upload-students',[AuthController::class, 'upload']);