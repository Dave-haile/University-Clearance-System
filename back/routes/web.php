<?php

use App\Http\Controllers\AuthController;
use App\Models\ClearanceRequest;
use App\Models\Department;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    User::all();
    return view('welcome');
});