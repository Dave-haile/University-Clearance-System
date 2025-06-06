<?php

namespace App\Http\Controllers;

use App\Models\ClearanceRequest;
use App\Models\Department;
use App\Models\Staff;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
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
    public function showProfile()
    {
        $user = Auth::user();
        $user = User::where('id', $user->id)
            ->with('staff.department')
            ->first();

        return response()->json($user);
    }
    public function displayRequests()
    {
        $user = Auth::user();
        $departmentId = $user->staff->department_id;
        $latestRequests = ClearanceRequest::with('student.user', 'department', 'student.department')
            ->whereHas('student', function ($query) use ($departmentId) {
                $query->where('department_id', $departmentId);
            })
            ->where('current_step',  'department_head')
            ->where('archived', false)
            ->where('status', '!=', 'rejected')
            ->get();
        // $requests = ClearanceRequest::where('archived', false)
        //     ->with('student.user', 'student.department', 'department')
        //     ->get();
        return response()->json($latestRequests);
    }
    public function dashboard()
    {
        $user = Auth::user();

        Log::info($user);
        $departmentId = $user->staff->department_id;

        Log::info($departmentId);
        $totalRequests = ClearanceRequest::whereHas('student', function ($query) use ($departmentId) {
            $query->where('department_id', $departmentId);
        })->count();

        $pendingRequests = ClearanceRequest::whereHas('student', function ($query) use ($departmentId) {
            $query->where('department_id', $departmentId);
        })->where('status', 'pending')->count();
        $approvedRequests = ClearanceRequest::whereHas('student', function ($query) use ($departmentId) {
            $query->where('department_id', $departmentId);
        })->where('status', 'approved')->count();
        $rejectedRequests = ClearanceRequest::whereHas('student', function ($query) use ($departmentId) {
            $query->where('department_id', $departmentId);
        })->where('status', 'rejected')->count();

        $latestRequests = ClearanceRequest::with('student.user', 'department', 'student.department')
            ->whereHas('student', function ($query) use ($departmentId) {
                $query->where('department_id', $departmentId);
            })->latest()->take(5)->get();

        $totalStudents = Student::where('department_id', $departmentId)->count();

        $firstYear = Student::where('department_id', $departmentId)->where('year', '1st Year')->count();
        $secondYear = Student::where('department_id', $departmentId)->where('year', '2nd Year')->count();
        $thirdYear = Student::where('department_id', $departmentId)->where('year', '3rd Year')->count();
        $fourthYear = Student::where('department_id', $departmentId)->where('year', '4th Year')->count();

        return response()->json([
            'totalRequests' => $totalRequests,
            'pendingRequests' => $pendingRequests,
            'apprevedRequests' => $approvedRequests,
            'rejectedRequests' => $rejectedRequests,
            'latestRequests' => $latestRequests,
            'totalStudents' => $totalStudents,
            'yearCounts' => [
                'firstYear' => $firstYear,
                'secondYear' => $secondYear,
                'thirdYear' => $thirdYear,
                'fourthYear' => $fourthYear,
            ],
            'user' => $user->load('staff.department')
        ]);
    }
    public function dispalyStudents()
    {
        $user = Auth::user();
        $departmentId = $user->staff->department_id;

        $students = User::with('student.clearance_requests', 'student.department')
            ->whereHas('student', function ($query) use ($departmentId) {
                $query->where('department_id', $departmentId);
            })
            ->get();

        if ($students->isEmpty()) {
            return response()->json(['message' => 'No students found in this department'], 404);
        }

        return response()->json($students);
    }
}
