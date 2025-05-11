<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class StaffController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'role' => 'required|string|in:library,cafeteria,department_head,proctor,registrar',
            'password' => 'required|string|min:8',
            'college' => 'required_if:role,department_head|string',
            'department' => 'required_if:role,department_head|string',
        ]);

        if ($validated['role'] === 'department_head') {
            $department = Department::where('department', $validated['department'])
                ->where('college', $validated['college'])
                ->first();

            if (!$department) {
                throw ValidationException::withMessages(['department' => 'Department not found in the selected college.']);
            }

            $existingHead = Staff::where('role', 'department_head')
                ->where('department_id', $department->id)
                ->first();

            if ($existingHead) {
                throw ValidationException::withMessages(['department' => 'A department head already exists for this department.']);
            }
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $validated['role'],
                'password' => Hash::make($validated['password']),
            ]);
            $staff = Staff::create([
                'user_id' => $user->id,
                'position' => 'Department Head',
                'role' => 'department_head',
                'department_id' => $department->id,
            ]);
        } else {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $validated['role'],
                'password' => Hash::make($validated['password']),
            ]);
            $staff = Staff::create([
                'user_id' => $user->id,
                'position' => ucfirst($validated['role']) . ' Staff', // Example: "Library Staff"
                'role' => $validated['role'],
            ]);
        }
        return response()->json([
            'message' => 'Staff member registered successfully.',
            'staff' => $staff,
            'user' => $user
        ], 201);
    }
    public function show()
    {
        $department = Department::with('departmentHead.user')->get();
        return response()->json($department);
    }
}
