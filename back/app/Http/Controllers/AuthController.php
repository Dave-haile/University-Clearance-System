<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateStudentRequest;
use App\Http\Requests\LoginRequest;
use App\Models\Department;
use App\Models\Student;
use App\Models\User;
use App\Services\ApiCacheService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\HasApiTokens;
use Str;

class AuthController extends Controller
{
    public function __construct(private ApiCacheService $apiCache) {}
    public function Signup(CreateStudentRequest $request)
    {
        $validated = $request->validated();

        $name = ucwords($validated["name"]);
        $nameParts = preg_split("/\s+/", trim($name));
        $password = ($nameParts[0] ?? "Student") . rand(1000, 9999);
        $fakeUserName = str_replace("/", "", $validated["student_id"]);
        $department = Department::where(
            "department",
            $validated["department"],
        )->first();

        if (!$department) {
            return response()->json(
                [
                    "error" =>
                        "Department not found: " . $validated["department"],
                ],
                422,
            );
        }

        $user = User::create([
            "name" => $name,
            "username" => $fakeUserName,
            "password" => Hash::make($password),
            "role" => "student",
        ]);

        Student::create([
            "user_id" => $user->id,
            "student_id" => $validated["student_id"],
            "department_id" => $department->id,
            "year" => $validated["year"],
        ]);

        $this->apiCache->bump([
            "admin_dashboard",
            "admin_users",
            "admin_departments",
            "users",
            "students",
            "departments",
            "clearance_requests",
        ]);

        return response()->json([
            "message" => "Student " . $user->name . " created successfully",
            "username" => $fakeUserName,
            "password" => $password,
        ]);
    }
    public function changePassword(Request $request)
    {
        $request->validate([
            "current_password" => "required|string",
            "new_password" => "required|string|min:8|confirmed",
        ]);
        $user = auth()->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(
                ["message" => "Current password is incorrect"],
                422,
            );
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        $this->apiCache->bump([
            "admin_dashboard",
            "admin_users",
            "users",
            "user:" . $user->id,
        ]);

        return response()->json(["message" => "Password changed successfully"]);
    }

    public function login(LoginRequest $request)
    {
        $request->validated();

        $credentals = $request->only("login", "password");
        $field = filter_var($credentals["login"], FILTER_VALIDATE_EMAIL)
            ? "email"
            : "username";
        $user = User::where(
            [
                $field => $credentals["login"],
            ],
            $request->username,
        )->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(
                [
                    "message" => "Bad Credentials",
                ],
                401,
            );
        }

        $token = $user->createToken($user->name)->plainTextToken;
        return [
            "user" => $user->load("student"),
            "token" => $token,
        ];
    }
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(["message" => "Logged out successfully"]);
    }
    public function me(Request $request)
    {
        return response()->json(["user" => $request->user()]);
    }
    public function upload(Request $request)
    {
        $request->validate([
            "file" => "required|mimes:csv,txt|max:10240",
        ]);

        $uploadedFile = $request->file("file");

        if (!file_exists(storage_path("app/uploads"))) {
            mkdir(storage_path("app/uploads"), 0777, true);
        }

        $uploadedFile->move(storage_path("app/uploads"), "students.csv");
        $fullPath = storage_path("app/uploads/students.csv");

        if (!file_exists($fullPath)) {
            Log::error("File not found: " . $fullPath);
            return response()->json(["error" => "File not found"], 500);
        }

        $file = fopen($fullPath, "r");
        if (!$file) {
            return response()->json(
                ["error" => "Failed to open the file"],
                500,
            );
        }

        $students = [];
        $firstRow = true;
        $departments = Department::select("id", "department")
            ->get()
            ->keyBy("department");

        while (($row = fgetcsv($file)) !== false) {
            if ($firstRow) {
                $firstRow = false;
                continue;
            }

            if (count($row) < 4) {
                continue;
            }

            $studentId = trim($row[0]);
            $name = ucwords(trim($row[1]));
            $departmentName = trim($row[2]);
            $year = trim($row[3]);

            if (
                $studentId === "" ||
                $name === "" ||
                $departmentName === "" ||
                $year === ""
            ) {
                continue;
            }

            $department = $departments->get($departmentName);

            if (!$department) {
                continue;
            }

            $nameParts = preg_split("/\s+/", $name);
            $password = ($nameParts[0] ?? "Student") . rand(1000, 9999);
            $fakeUserName = str_replace("/", "", $studentId);

            $user = User::create([
                "name" => $name,
                "username" => $fakeUserName,
                "password" => Hash::make($password),
                "role" => "student",
            ]);

            Student::create([
                "user_id" => $user->id,
                "student_id" => $studentId,
                "department_id" => $department->id,
                "year" => $year,
            ]);

            $students[] = [
                "student_id" => $studentId,
                "name" => $name,
                "username" => $fakeUserName,
                "department" => $departmentName,
                "password" => $password,
                "year" => $year,
                "created_at" => now(),
                "updated_at" => now(),
            ];
        }

        fclose($file);

        if (!empty($students)) {
            $this->apiCache->bump([
                "admin_dashboard",
                "admin_users",
                "admin_departments",
                "users",
                "students",
                "departments",
                "clearance_requests",
            ]);
        }

        return response()->json([
            "message" => !empty($students)
                ? "Students Accounts is Created successfully"
                : "No valid students were imported",
            "students" => $students,
        ]);
    }
}
