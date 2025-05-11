<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateStudentRequest;
use App\Http\Requests\LoginRequest;
use App\Models\Department;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\HasApiTokens;
use Str;

class AuthController extends Controller
{
    public function Signup(CreateStudentRequest $request)
    {
        logger($request);
        $validated = $request->validated();

        $name = ucwords($validated['name']);
        $nameParts = explode(" ", $name);
        $password = $nameParts[0] . rand(1000, 9999);
        $fakeUserName = str_replace('/', '', $validated['student_id']);
        $department = Department::where('department', $validated['department'])->first();
        logger($department->department);
        logger($department->college);
        logger($department->id);    

        if (!$department) {
            return response()->json([
                'error' => 'Department not found: ' . $validated['department']
            ], 422);
        }
        $user = User::create([
            'name' => $name,
            'username' => $fakeUserName,
            'password' => Hash::make($password),
            'role' => 'student'
        ]);

        logger($user);
        Student::create([
            'user_id' => $user->id,
            'student_id' => $validated['student_id'],
            'department_id' => $department->id,
            'year' => $validated['year']
        ]);
        logger($user->student);

        return response()->json([
            'message' => 'Student ' . $user->name . ' created successfully',
            'username' => $fakeUserName,
            'password' => $password
        ]);
    }
    public function login(LoginRequest $request)
    {
        $request->validated();

        $credentals = $request->only('login', 'password');
        $field = filter_var($credentals['login'], FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        $user = User::where([
            $field => $credentals['login']
        ], $request->username)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Bad Credentials'
            ], 401);
        }

        $token = $user->createToken($user->name)->plainTextToken;
        return [
            'user' => $user->load('student'),
            'token' => $token
        ];
    }
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
    public function me(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt|max:10240',
        ]);

        $file = $request->file('file');

        if (!file_exists(storage_path('app/uploads'))) {
            mkdir(storage_path('app/uploads'), 0777, true);
        }

        $file->move(storage_path('app/uploads'), 'students.csv');
        $fullPath = storage_path('app/uploads/students.csv');

        if (!file_exists($fullPath)) {
            Log::error('File not found: ' . $fullPath);
            return response()->json(['error' => 'File not found'], 500);
        }

        $file = fopen($fullPath, 'r');
        if (!$file) {
            return response()->json(['error' => 'Failed to open the file'], 500);
        }

        $students = [];
        $stuData = []; // Change to an array to store all students
        $firstRow = true;

        while (($row = fgetcsv($file)) !== false) {
            if ($firstRow) {
                $firstRow = false;
                continue;
            }
            $name = ucwords($row[1]);
            $nameParts = explode(' ', $name);
            $password = $nameParts[0] . rand(1000, 9999);
            $fakeUserName = str_replace('/', '', $row[0]);

            $user = User::create([
                'name' => $name,
                'username' => $fakeUserName,
                'password' => Hash::make($password),
                'role' => 'student'
            ]);

            Student::create([
                'user_id' => $user->id,
                'student_id' => $row[0],
                'department' => $row[2],
                'year' => $row[3]
            ]);

            $students[] = [
                'student_id' => $row[0],
                'name' => $row[1],
                'username' => $fakeUserName,
                'department' => $row[2],
                'password' => $password,
                'year' => $row[3],
                'created_at' => now(),
                'updated_at' => now(),
            ];
            return response()->json([
                'message' => 'Student Account is Created For ' . $students['name'],
                'students' => $students
            ]);
        }

        fclose($file);

        return response()->json([
            'message' => 'Students Accounts is Created successfully',
            'students' => $students,
        ]);
    }
}
