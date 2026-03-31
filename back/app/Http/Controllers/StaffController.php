<?php

namespace App\Http\Controllers;

use App\Models\ClearanceRequest;
use App\Models\Department;
use App\Models\Staff;
use App\Models\Student;
use App\Models\User;
use App\Services\ApiCacheService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class StaffController extends Controller
{
    public function __construct(private ApiCacheService $apiCache) {}
    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "required|string|max:255",
            "email" => "required|email|max:255|unique:users,email",
            "role" =>
                "required|string|in:library,cafeteria,department_head,proctor,registrar",
            "password" => "required|string|min:8",
            "college" => "required_if:role,department_head|string",
            "department" => "required_if:role,department_head|string",
        ]);

        if ($validated["role"] === "department_head") {
            $department = Department::where(
                "department",
                $validated["department"],
            )
                ->where("college", $validated["college"])
                ->first();

            if (!$department) {
                throw ValidationException::withMessages([
                    "department" =>
                        "Department not found in the selected college.",
                ]);
            }

            $existingHead = Staff::where("role", "department_head")
                ->where("department_id", $department->id)
                ->first();

            if ($existingHead) {
                throw ValidationException::withMessages([
                    "department" =>
                        "A department head already exists for this department.",
                ]);
            }
            $user = User::create([
                "name" => $validated["name"],
                "email" => $validated["email"],
                "role" => $validated["role"],
                "password" => Hash::make($validated["password"]),
            ]);
            $staff = Staff::create([
                "user_id" => $user->id,
                "position" => "Department Head",
                "role" => "department_head",
                "department_id" => $department->id,
            ]);
        } else {
            $user = User::create([
                "name" => $validated["name"],
                "email" => $validated["email"],
                "role" => $validated["role"],
                "password" => Hash::make($validated["password"]),
            ]);
            $staff = Staff::create([
                "user_id" => $user->id,
                "position" => ucfirst($validated["role"]) . " Staff", // Example: "Library Staff"
                "role" => $validated["role"],
            ]);
        }
        $this->apiCache->bump([
            "staff_dashboard",
            "staff_profile",
            "staff_display_requests",
            "staff_students",
            "department_display",
            "admin_dashboard",
            "admin_users",
            "admin_departments",
            "users",
            "staff",
            "students",
            "departments",
        ]);

        return response()->json(
            [
                "message" => "Staff member registered successfully.",
                "staff" => $staff,
                "user" => $user,
            ],
            201,
        );
    }
    public function show()
    {
        $department = $this->apiCache->remember(
            ["department_display", "departments", "staff", "users"],
            "staff.department_display",
            300,
            function () {
                return Department::with("departmentHead.user")->get();
            },
        );

        return response()->json($department);
    }
    public function showProfile()
    {
        $authUser = Auth::user();

        $user = $this->apiCache->remember(
            [
                "staff_profile",
                "users",
                "staff",
                "departments",
                "user:" . $authUser->id,
            ],
            "staff.profile." . $authUser->id,
            300,
            function () use ($authUser) {
                return User::where("id", $authUser->id)
                    ->with("staff.department")
                    ->first();
            },
        );

        return response()->json($user);
    }
    public function displayRequests()
    {
        $user = Auth::user();
        $departmentId = $user->staff->department_id;

        $latestRequests = $this->apiCache->remember(
            [
                "staff_display_requests",
                "clearance_requests",
                "students",
                "departments",
                "users",
                "department:" . $departmentId,
                "user:" . $user->id,
            ],
            "staff.display_requests." . $departmentId,
            180,
            function () use ($departmentId) {
                return ClearanceRequest::with(
                    "student.user",
                    "department",
                    "student.department",
                )
                    ->where("department_id", $departmentId)
                    ->where("current_step", "department_head")
                    ->where("archived", false)
                    ->where("status", "!=", "rejected")
                    ->get();
            },
        );

        return response()->json($latestRequests);
    }
    public function dashboard()
    {
        $user = Auth::user();
        $departmentId = $user->staff->department_id;

        $data = $this->apiCache->remember(
            [
                "staff_dashboard",
                "clearance_requests",
                "students",
                "departments",
                "users",
                "staff",
                "department:" . $departmentId,
                "user:" . $user->id,
            ],
            "staff.dashboard." . $departmentId,
            180,
            function () use ($departmentId, $user) {
                $requestCounts = ClearanceRequest::selectRaw(
                    "status, COUNT(*) as total",
                )
                    ->where("department_id", $departmentId)
                    ->groupBy("status")
                    ->pluck("total", "status");

                $latestRequests = ClearanceRequest::with(
                    "student.user",
                    "department",
                    "student.department",
                )
                    ->where("department_id", $departmentId)
                    ->latest()
                    ->take(5)
                    ->get();

                $totalStudents = Student::where(
                    "department_id",
                    $departmentId,
                )->count();

                $yearCounts = Student::selectRaw("year, COUNT(*) as total")
                    ->where("department_id", $departmentId)
                    ->groupBy("year")
                    ->pluck("total", "year");

                return [
                    "totalRequests" => (int) $requestCounts->sum(),
                    "pendingRequests" => (int) ($requestCounts["pending"] ?? 0),
                    "apprevedRequests" =>
                        (int) ($requestCounts["approved"] ?? 0),
                    "rejectedRequests" =>
                        (int) ($requestCounts["rejected"] ?? 0),
                    "latestRequests" => $latestRequests,
                    "totalStudents" => $totalStudents,
                    "yearCounts" => [
                        "firstYear" => (int) ($yearCounts["1st Year"] ?? 0),
                        "secondYear" => (int) ($yearCounts["2nd Year"] ?? 0),
                        "thirdYear" => (int) ($yearCounts["3rd Year"] ?? 0),
                        "fourthYear" => (int) ($yearCounts["4th Year"] ?? 0),
                    ],
                    "user" => $user->load("staff.department"),
                ];
            },
        );

        return response()->json($data);
    }
    public function dispalyStudents()
    {
        $user = Auth::user();
        $departmentId = $user->staff->department_id;

        $data = $this->apiCache->remember(
            [
                "staff_students",
                "users",
                "students",
                "departments",
                "clearance_requests",
                "department:" . $departmentId,
                "user:" . $user->id,
            ],
            "staff.students." . $departmentId,
            180,
            function () use ($departmentId) {
                $students = User::with(
                    "student.clearance_requests",
                    "student.department",
                )
                    ->whereHas("student", function ($query) use (
                        $departmentId,
                    ) {
                        $query->where("department_id", $departmentId);
                    })
                    ->get();

                if ($students->isEmpty()) {
                    return [
                        "status" => 404,
                        "data" => [
                            "message" => "No students found in this department",
                        ],
                    ];
                }

                return [
                    "status" => 200,
                    "data" => $students,
                ];
            },
        );

        return response()->json($data["data"], $data["status"]);
    }
}
