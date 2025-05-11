<?php

namespace App\Http\Controllers;

use App\Models\ClearanceRequest;
use App\Models\Department;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

use function Laravel\Prompts\table;

class AdminController extends Controller
{
    public function index()
    {
        $totalUsers = DB::table('users')->count();
        $totalStudents = DB::table('users')->where('role', 'student')->count();
        $totalStudent = DB::table('students')->count();
        $staffRoles = ['department_head', 'library', 'cafeteria', 'proctor', 'registrar'];
        $totalStaff = DB::table('users')->whereIn('role', $staffRoles)->count();
        $totalDepartments = DB::table('departments')->count();
        $totalDepartments = DB::table('departments')->count();
        $totalColleges = DB::table('departments')->distinct('college')->count('college');
        $counts = Staff::select('role', DB::raw('count(*) as total'))
            ->groupBy('role')
            ->get()
            ->keyBy('role')
            ->map(fn($item) => $item->total);
        return response()->json([
            'total_users' => $totalUsers,
            'total_students' => $totalStudents,
            'total_staff' => $totalStaff,
            'total_departments' => $totalDepartments,
            'total_student' => $totalStudent,
            'total_colleges' => $totalColleges,
            'totals' => [
                'all' => ClearanceRequest::count(),
                'approved' => ClearanceRequest::where('status', 'approved')->count(),
                'pending' => ClearanceRequest::where('status', 'pending')->count(),
                'rejected' => ClearanceRequest::where('status', 'rejected')->count(),
            ],
            'byDepartment' => ClearanceRequest::select('department', DB::raw('count(*) as total'))
                ->groupBy('department')
                ->get(),
            'byMonth' => ClearanceRequest::selectRaw("TO_CHAR(created_at, 'YYYY-MM') as month, count(*) as total")
                ->groupBy('month')
                ->orderBy('month')
                ->get(),
            'recentRequests' => ClearanceRequest::with('student.user')->latest()->take(5)->get(),
            'staffRoles' => [
                'department_head' => $counts['department_head'] ?? 0,
                'library' => $counts['library'] ?? 0,
                'cafeteria' => $counts['cafeteria'] ?? 0,
                'proctor' => $counts['proctor'] ?? 0,
                'registrar' => $counts['registrar'] ?? 0,
            ]
        ]);
    }
    public function users(Request $request)
    {
        $query = User::with('staff', 'staff.department', 'student.clearance_requests', 'student.department');

        return response()->json($query->get());
    }
    // public function users(Request $request)
    // {
    //     $query = User::with('staff', 'staff.department', 'student.clearance_requests', 'student.department');

    //     // Role filter
    //     if ($request->has('role') && $request->role !== 'all') {
    //         $query->where('role', $request->role);
    //     }

    //     // Search term
    //     if ($request->has('search')) {
    //         $search = $request->search;
    //         $query->where(function ($q) use ($search) {
    //             $q->where('name', 'like', "%{$search}%")
    //                 ->orWhere('username', 'like', "%{$search}%")
    //                 ->orWhere('email', 'like', "%{$search}%");
    //         });
    //     }

    //     // Sorting
    //     if ($request->has('sort_by')) {
    //         $sortDirection = $request->sort_dir === 'desc' ? 'desc' : 'asc';
    //         $query->orderBy($request->sort_by, $sortDirection);
    //     }

    //     $perPage = $request->input('per_page', 10);
    //     return $query->paginate($perPage);
    // }
    public function create(Request $request)
    {
        $validated = $request->validate([
            'department' => 'required|string|max:255',
            'college' => 'required|string|max:255',
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255|unique:users,email',
            'password' => 'nullable|string|min:8'
        ]);
        $existingDepartment = Department::where('department', $validated['department'])
            ->where('college', $validated['college'])
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
        if (
            !empty(trim($validated['name'] ?? '')) &&
            !empty(trim($validated['email'] ?? '')) &&
            !empty(trim($validated['password'] ?? ''))
        ) {

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => bcrypt($validated['password']),
                'role' => 'department_head'
            ]);
            $staff = Staff::create(([
                'user_id' => $user->id,
                'position' => 'Department Head',
                'role' => 'department_head',
                'department_id' => $department->id,
            ]));
        }

        return response()->json([
            'message' => 'Department created successfully',
            'department' => $department,
            'user' => $user,$staff
        ], 201);
    }
    public function deleteDepartment() {
        
    }
    public function displayRequests()
    {
        Auth::user();
        $data = ClearanceRequest::where('archived', false)->get();
        $data->load('student.user', 'student.department');
        return response()->json($data);
    }
    public function depart()
    {
        Auth::user();
        $departmentCount = DB::table('departments')->count();
        $collegeCount = DB::table('departments')->distinct()->count('college');
        $department = Department::with('students', 'departmentHead.user');
        $departmentHead = User::where('role', 'department_head');
        return response()->json([
            'departments' => $department->get(),
            'department_head' => $departmentHead->get(),
            'stats' => [
                'total_departments' => $departmentCount,
                'unique_colleges' => $collegeCount
            ]
        ]);
    }

    public function show($id)
    {
        $user = User::with('student.clearance_requests', 'student.department', 'staff.department')->findOrFail($id);
        $clearances = ClearanceRequest::where('student_id', $user->student->student_id ?? null)->get();

        return response()->json(compact('user', 'clearances'));
    }
    // public function show($id)
    // {
    //     $user = User::with(['staff.department', 'student.department'])->findOrFail($id);
    //     $clearances = ClearanceRequest::where('student_id', $user->student->student_id ?? null)->get();
    //     return response()->json(compact('user', 'clearances'));
    // }
    public function resetPassword(Request $request, $id)
    {
        $request->validate([
            'username' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'password' => 'required|string|min:8',
        ]);

        $user = User::findOrFail($id);
        $user->username = $request->username ?? $user->username;
        $user->email = $request->email ?? $user->email;
        if ($request->has('email')) {
            $existingUser = User::where('email', $request->email)->first();
            if ($existingUser && $existingUser->id !== $user->id) {
                return response()->json(['message' => 'Email already exists.'], 400);
            }
        }
        if ($request->has('username')) {
            $existingUser = User::where('username', $request->username)->first();
            if ($existingUser && $existingUser->id !== $user->id) {
                return response()->json(['message' => 'Username already exists.'], 400);
            }
        }
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json(['message' => 'Password reset successfully.']);
    }
    public function destroy($id)
    {
        Log::info($id);
        $user = User::findOrFail($id);
        if (!$user->role === 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if ($user->id === Auth::id()) {
            return response()->json(['message' => 'You cannot delete your own account.'], 403);
        }
        $user->delete();
        return response()->json(['message' => 'User deleted successfully.']);
    }
    public function archiveClearanceRequests(Request $request)
    {
        ClearanceRequest::where('archived', true)->update(['archived' => false]);

        return response()->json(['message' => 'All clearance requests archived successfully.']);
    }
}
