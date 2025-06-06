<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClearanceApprovalController;
use App\Http\Controllers\ClearanceRequestController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/create-student', [AuthController::class, 'Signup']);

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/clearance-request', [ClearanceRequestController::class, 'store']);
    Route::get('/student/clearance-requests', [ClearanceRequestController::class, 'show']);
    Route::get('/clearance-requests', [ClearanceRequestController::class, 'index']);
    Route::put('/clearance-approval/{id}', [ClearanceApprovalController::class, 'update']);
    Route::post('/approve-clearance/{id}', [ClearanceRequestController::class, 'approveClearance']);
    Route::get('/departmentDisplay', [StaffController::class, 'show']);
    Route::post('/staffAccountCreation', [StaffController::class, 'store']);
    Route::post('profile-image', [UserController::class, 'updateProfilePicture']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::post('/update-profile', [UserController::class, 'updateProfile']);
});
// Admin routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/admin/create-department', [AdminController::class, 'create']);
    Route::get('/admin/departmentDisplay', [AdminController::class, 'depart']);
    Route::delete('/admin/department-delete', [AdminController::class, 'deleteDepartment']);
    Route::get('/admin/dashboard', [AdminController::class, 'index']);
    Route::get('/admin/users', [AdminController::class, 'users']);
    Route::get('/admin/clearanceRequests', [AdminController::class, 'displayRequests']);
    Route::get('/admin/users/{userId}', [AdminController::class, 'show']);
    Route::post('/admin/archive-clearance-requests', [AdminController::class, 'archiveClearanceRequests']);
    Route::post('/admin/users/{id}/update', [AdminController::class, 'update']);
    Route::delete('/admin/users/{id}/delete', [AdminController::class, 'destroy']);
    Route::put('/admin/users/{id}/reset-password', [AdminController::class, 'resetPassword']);
});
// Student routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/student/clearance-requests', [StudentController::class, 'show']);
    Route::get('/student/data', [StudentController::class, 'index']);
    Route::get('/student/alldata', [StudentController::class, 'fetchAll']);
    Route::get('/student/clearace-history', [StudentController::class, 'clear']);
    Route::get('/student/profile/show', [StudentController::class, 'showProfile']);
    Route::post('/student/profile/update', [StudentController::class, 'updateProfile']);
});

// Staff routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/staff/dashboard', [StaffController::class, 'dashboard']);
    Route::get('/staff/profile/show', [StaffController::class, 'showProfile']);
    Route::get('/staff/displayRequests', [StaffController::class, 'displayRequests']);
    Route::get('/staff/students', [StaffController::class, 'dispalyStudents']);
});

Route::get('/Allclearance-requsets', [ClearanceRequestController::class, 'display']);
Route::post('/upload-students', [AuthController::class, 'upload']);
