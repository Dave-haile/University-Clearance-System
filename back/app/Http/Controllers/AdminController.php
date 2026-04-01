<?php

namespace App\Http\Controllers;

use App\Models\ClearanceRequest;
use App\Models\Department;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Services\ApiCacheService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function __construct(private ApiCacheService $apiCache) {}
    public function index()
    {
        $data = $this->apiCache->remember(
            [
                "admin_dashboard",
                "users",
                "students",
                "staff",
                "departments",
                "clearance_requests",
            ],
            "admin.dashboard",
            300,
            function () {
                $staffRoles = [
                    "department_head",
                    "library",
                    "cafeteria",
                    "proctor",
                    "registrar",
                ];

                $roleCounts = DB::table("users")
                    ->select("role", DB::raw("COUNT(*) as total"))
                    ->whereIn("role", array_merge(["student"], $staffRoles))
                    ->groupBy("role")
                    ->pluck("total", "role");

                $requestCounts = ClearanceRequest::selectRaw(
                    "status, COUNT(*) as total",
                )
                    ->where("archived", false)
                    ->groupBy("status")
                    ->pluck("total", "status");

                $totalUsers = DB::table("users")->count();
                $totalStudent = DB::table("students")->count();
                $totalDepartments = DB::table("departments")->count();
                $totalColleges = DB::table("departments")
                    ->distinct("college")
                    ->count("college");
                $counts = Staff::select("role", DB::raw("count(*) as total"))
                    ->groupBy("role")
                    ->get()
                    ->keyBy("role")
                    ->map(fn($item) => $item->total);

                return [
                    "total_users" => $totalUsers,
                    "total_students" => (int) ($roleCounts["student"] ?? 0),
                    "total_staff" => (int) $roleCounts
                        ->except("student")
                        ->sum(),
                    "total_departments" => $totalDepartments,
                    "total_student" => $totalStudent,
                    "total_colleges" => $totalColleges,
                    "totals" => [
                        "all" => (int) $requestCounts->sum(),
                        "approved" => (int) ($requestCounts["approved"] ?? 0),
                        "pending" => (int) ($requestCounts["pending"] ?? 0),
                        "rejected" => (int) ($requestCounts["rejected"] ?? 0),
                    ],
                    // limit 7 department
                    "byDepartment" => ClearanceRequest::where("archived", false)
                        ->join(
                            "departments",
                            "clearance_requests.department_id",
                            "=",
                            "departments.id",
                        )
                        ->select(
                            "departments.department as department",
                            DB::raw("count(*) as total"),
                        )
                        ->groupBy("departments.department")
                        ->get(),
                    "byMonth" => ClearanceRequest::where("archived", false)
                        ->selectRaw(
                            "TO_CHAR(created_at, 'YYYY-MM') as month, count(*) as total",
                        )
                        ->groupBy("month")
                        ->orderBy("month")
                        ->get(),
                    "recentRequests" => ClearanceRequest::where(
                        "archived",
                        false,
                    )
                        ->with("student.user")
                        ->latest()
                        ->take(5)
                        ->get(),
                    "staffRoles" => [
                        "department_head" => $counts["department_head"] ?? 0,
                        "library" => $counts["library"] ?? 0,
                        "cafeteria" => $counts["cafeteria"] ?? 0,
                        "proctor" => $counts["proctor"] ?? 0,
                        "registrar" => $counts["registrar"] ?? 0,
                    ],
                ];
            },
        );

        return response()->json($data);
    }
    public function users(Request $request)
    {
        $perPage = (int) $request->query("limit", 20);
        $allowedLimits = [20, 100, 500];
        $search = trim((string) $request->query("search", ""));
        $role = $request->query("role", "all");
        $page = max((int) $request->query("page", 1), 1);
        $sortBy = $request->query("sort_by", "name");
        $sortDirection =
            $request->query("sort_dir", "asc") === "desc" ? "desc" : "asc";

        if (!in_array($perPage, $allowedLimits, true)) {
            $perPage = 20;
        }

        if (!in_array($sortBy, ["name", "email", "created_at"], true)) {
            $sortBy = "name";
        }

        $users = $this->apiCache->rememberRequest(
            [
                "admin_users",
                "users",
                "students",
                "staff",
                "departments",
                "clearance_requests",
            ],
            $request,
            300,
            function () use (
                $perPage,
                $search,
                $role,
                $page,
                $sortBy,
                $sortDirection,
            ) {
                $query = User::with(
                    "staff",
                    "staff.department",
                    "student.clearance_requests",
                    "student.department",
                );

                if ($role !== "all") {
                    $query->where("role", $role);
                }

                if ($search !== "") {
                    $query->where(function ($q) use ($search) {
                        $q->where("name", "like", "%{$search}%")
                            ->orWhere("username", "like", "%{$search}%")
                            ->orWhere("email", "like", "%{$search}%")
                            ->orWhereHas("student", function ($studentQuery) use (
                                $search,
                            ) {
                                $studentQuery->where(
                                    "student_id",
                                    "like",
                                    "%{$search}%",
                                );
                            });
                    });
                }

                if ($sortBy === "email") {
                    $query->orderByRaw(
                        "COALESCE(email, username, '') " . $sortDirection,
                    );
                } else {
                    $query->orderBy($sortBy, $sortDirection);
                }

                return $query->paginate($perPage, ["*"], "page", $page);
            },
            "admin.users",
        );

        return response()->json($users);
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
            "department" => "required|string|max:255",
            "college" => "required|string|max:255",
            "name" => "nullable|string|max:255",
            "email" => "nullable|email|max:255|unique:users,email",
            "password" => "nullable|string|min:8",
        ]);
        $existingDepartment = Department::where(
            "department",
            $validated["department"],
        )
            ->where("college", $validated["college"])
            ->first();

        if ($existingDepartment) {
            return response()->json(
                [
                    "message" =>
                    "This department already exists in the selected college.",
                ],
                400,
            );
        }

        $department = Department::create([
            "department" => $validated["department"],
            "college" => $validated["college"],
        ]);

        $user = null;
        $staff = null;

        if (
            !empty(trim($validated["name"] ?? "")) &&
            !empty(trim($validated["email"] ?? "")) &&
            !empty(trim($validated["password"] ?? ""))
        ) {
            $user = User::create([
                "name" => $validated["name"],
                "email" => $validated["email"],
                "password" => bcrypt($validated["password"]),
                "role" => "department_head",
            ]);

            $staff = Staff::create([
                "user_id" => $user->id,
                "position" => "Department Head",
                "role" => "department_head",
                "department_id" => $department->id,
            ]);
        }

        $this->apiCache->bump([
            "admin_dashboard",
            "admin_departments",
            "departments",
            "admin_users",
            "users",
            "staff",
        ]);

        return response()->json(
            [
                "message" => "Department created successfully",
                "department" => $department,
                "user" => $user,
                "staff" => $staff,
            ],
            201,
        );
    }
    public function deleteDepartment() {}
    public function displayRequests(Request $request)
    {
        Auth::user();

        $limit = (int) $request->query("limit", 20);
        $allowedLimits = [20, 100, 500];

        if (!in_array($limit, $allowedLimits, true)) {
            $limit = 20;
        }

        $data = $this->apiCache->rememberRequest(
            [
                "admin_clearance_requests",
                "clearance_requests",
                "students",
                "departments",
                "users",
            ],
            $request,
            180,
            function () use ($limit) {
                return ClearanceRequest::where("archived", false)
                    ->with("student.user", "student.department", "department")
                    ->latest()
                    ->limit($limit)
                    ->get();
            },
            "admin.clearance_requests",
        );

        return response()->json($data);
    }
    public function displaySingleClearace($clearanceid)
    {
        $clearance = $this->apiCache->remember(
            [
                "admin_clearance_requests",
                "clearance_requests",
                "students",
                "departments",
                "users",
            ],
            "admin.clearance_requests." . $clearanceid,
            180,
            function () use ($clearanceid) {
                return ClearanceRequest::with(
                    "student.user",
                    "student.department",
                    "department",
                )->find($clearanceid);
            },
        );

        return response()->json($clearance);
    }
    public function depart(Request $request)
    {
        Auth::user();

        $limit = (int) $request->query("limit", 20);
        $allowedLimits = [20, 100, 500];

        if (!in_array($limit, $allowedLimits, true)) {
            $limit = 20;
        }

        $data = $this->apiCache->rememberRequest(
            ["admin_departments", "departments", "users", "students", "staff"],
            $request,
            300,
            function () use ($limit) {
                $departmentCount = DB::table("departments")->count();
                $collegeCount = DB::table("departments")
                    ->distinct()
                    ->count("college");
                $department = Department::with(
                    "students",
                    "departmentHead.user",
                )
                    ->latest()
                    ->limit($limit);
                $departmentHead = User::where("role", "department_head");

                return [
                    "departments" => $department->get(),
                    "department_head" => $departmentHead->get(),
                    "stats" => [
                        "total_departments" => $departmentCount,
                        "unique_colleges" => $collegeCount,
                    ],
                ];
            },
            "admin.departments",
        );

        return response()->json($data);
    }

    public function show($id)
    {
        $data = $this->apiCache->remember(
            [
                "admin_users",
                "users",
                "students",
                "staff",
                "departments",
                "clearance_requests",
            ],
            "admin.user." . $id,
            300,
            function () use ($id) {
                $user = User::with(
                    "student.clearance_requests.department",
                    "student.department",
                    "staff.department",
                )->findOrFail($id);

                return [
                    "user" => $user,
                    "clearances" =>
                    $user->student?->clearance_requests ?? collect(),
                ];
            },
        );

        return response()->json($data);
    }
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            "name" => "sometimes|string|max:255",
            "username" => [
                "sometimes",
                "nullable",
                "string",
                "max:255",
                Rule::unique("users", "username")->ignore($id),
            ],
            "email" => [
                "sometimes",
                "nullable",
                "email",
                "max:255",
                Rule::unique("users", "email")->ignore($id),
            ],
            "role" =>
            "sometimes|string|in:student,admin,department_head,library,cafeteria,proctor,registrar",
            "student" => "sometimes|array",
            "student.student_id" => "sometimes|string|max:255",
            "student.year" => "sometimes|string|max:255",
            "student.department_id" =>
            "sometimes|nullable|exists:departments,id",
            "staff" => "sometimes|array",
            "staff.position" => "sometimes|string|max:255",
            "staff.department_id" => "sometimes|nullable|exists:departments,id",
            "staff.role" =>
            "sometimes|string|in:department_head,library,cafeteria,proctor,registrar",
        ]);

        $user = User::with("student", "staff")->findOrFail($id);

        foreach (["name", "username", "email", "role"] as $field) {
            if (array_key_exists($field, $validated)) {
                $user->{$field} = $validated[$field];
            }
        }
        $user->save();

        if (isset($validated["student"]) && $user->student) {
            $studentData = $validated["student"];
            foreach (["student_id", "year", "department_id"] as $field) {
                if (array_key_exists($field, $studentData)) {
                    $user->student->{$field} = $studentData[$field];
                }
            }
            $user->student->save();
        }

        if (isset($validated["staff"]) && $user->staff) {
            $staffData = $validated["staff"];
            foreach (["position", "department_id", "role"] as $field) {
                if (array_key_exists($field, $staffData)) {
                    $user->staff->{$field} = $staffData[$field];
                }
            }
            $user->staff->save();
        }

        $this->apiCache->bump([
            "admin_dashboard",
            "admin_users",
            "admin_departments",
            "staff_students",
            "staff_dashboard",
            "users",
            "students",
            "staff",
            "departments",
            "clearance_requests",
            "admin_clearance_requests",
            "user:" . $user->id,
        ]);

        return response()->json([
            "message" => "User updated successfully.",
            "user" => $user->fresh([
                "student.department",
                "student.clearance_requests",
                "staff.department",
            ]),
        ]);
    }
    public function resetPassword(Request $request, $id)
    {
        $request->validate([
            "username" => "nullable|string|max:255",
            "email" => "nullable|email|max:255",
            "password" => "required|string|min:8",
        ]);

        $user = User::findOrFail($id);
        $user->username = $request->username ?? $user->username;
        $user->email = $request->email ?? $user->email;
        if ($request->has("email")) {
            $existingUser = User::where("email", $request->email)->first();
            if ($existingUser && $existingUser->id !== $user->id) {
                return response()->json(
                    ["message" => "Email already exists."],
                    400,
                );
            }
        }
        if ($request->has("username")) {
            $existingUser = User::where(
                "username",
                $request->username,
            )->first();
            if ($existingUser && $existingUser->id !== $user->id) {
                return response()->json(
                    ["message" => "Username already exists."],
                    400,
                );
            }
        }
        $user->password = Hash::make($request->password);
        $user->save();

        $this->apiCache->bump(["admin_dashboard", "admin_users", "users"]);

        return response()->json(["message" => "Password reset successfully."]);
    }
    public function destroy($id)
    {
        Log::info($id);
        $user = User::findOrFail($id);
        if (!$user->role === "admin") {
            return response()->json(["message" => "Unauthorized"], 403);
        }
        if ($user->id === Auth::id()) {
            return response()->json(
                ["message" => "You cannot delete your own account."],
                403,
            );
        }
        $user->delete();

        $this->apiCache->bump([
            "admin_dashboard",
            "admin_users",
            "admin_departments",
            "users",
            "students",
            "staff",
            "departments",
            "clearance_requests",
            "admin_clearance_requests",
        ]);

        return response()->json(["message" => "User deleted successfully."]);
    }
    public function archiveClearanceRequests(Request $request)
    {
        ClearanceRequest::where("archived", false)->update([
            "archived" => true,
        ]);

        $this->apiCache->bump([
            "admin_dashboard",
            "clearance_requests",
            "admin_clearance_requests",
            "users",
            "students",
            "departments",
        ]);

        return response()->json([
            "message" => "All clearance requests archived successfully.",
        ]);
    }
}
