<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function create(Request $request)
    {
        $validated = $request->validate([
            'department' => 'required|string|max:255',
            'college' => 'required|string|max:255',
        ]);
        $existingDepartment = Department::where('department', $request->name)
            ->where('college', $request->college)
            ->first();

        if ($existingDepartment) {
            return response()->json([
                'message' => 'This department already exists in the selected college.'
            ], 400);
        }
        $department = Department::create([
            'department' => $validated['department'],
            'college' => $validated['college'],
        ]);
        return response()->json([
            'message' => 'Department created successfully',
            'department' => $department,
        ], 201);
    }
}
