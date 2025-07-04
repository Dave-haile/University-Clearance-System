<?php

namespace App\Http\Controllers;

use App\Http\Requests\ClearanceRequestRequest;
use App\Models\ClearanceRequest;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class ClearanceRequestController extends Controller
{
    // public function store(ClearanceRequestRequest $request)
    // {
    //     $user = Auth::user();

    //     $student = Student::where('user_id', $user->id)->first();

    //     if (!$student) {
    //         return response()->json(['message' => 'Student not found'], 404);
    //     }

    //     $student_id = $student->student_id;

    //     $validatedData = $request->validated();

    //     if (!isset($validatedData['sex'])) {
    //         return response()->json(['message' => 'Sex field is required'], 400);
    //     }

    //     if (ClearanceRequest::where('student_id', $student_id)
    //         ->where('status', 'pending')
    //         ->where('archived', false)
    //         ->exists()
    //     ) {
    //         return response()->json(['message' => 'You already have a pending clearance request'], 400);
    //     }

    //     $clearanceRequest = ClearanceRequest::create([
    //         'student_id' => $student_id,
    //         'sex' => $validatedData['sex'],
    //         'status' => 'pending',
    //         'year' => $validatedData['year'],
    //         'semester' => $validatedData['semester'],
    //         'section' => $validatedData['section'],
    //         'department' => $validatedData['department'],
    //         'college' => $validatedData['college'],
    //         'academic_year' => $validatedData['academic_year'],
    //         'last_day_class_attended' => $validatedData['last_day_class_attended'],
    //         'reason_for_clearance' => $validatedData['reason_for_clearance'],
    //         'cafe_status' => $validatedData['cafe_status'],
    //         'dorm_status' => $validatedData['dorm_status'],
    //         'archived' => false
    //     ]);

    //     return response()->json([
    //         'message' => 'Clearance request submitted successfully',
    //         "clearanceRequest" => $clearanceRequest
    //     ], 201);
    // }


    public function store(ClearanceRequestRequest $request)
    {
        $user = Auth::user();
        $student = Student::where('user_id', $user->id)->first();

        if (!$student) {
            return response()->json(['message' => 'student not found']);
        }
        if (!$student->department_id) {
            return response()->json(['message' => 'Student department not found'], 400);
        }

        $student_id = $student->student_id;

        $validatedData = $request->validated();

        if (!isset($validatedData['sex'])) {
            return response()->json(['message' => 'Sex field is required'], 400);
        }

        // Check if the student already has a pending request
        if (ClearanceRequest::where('student_id', $student_id)
            ->where('status', 'pending')
            ->where('archived', false)
            ->exists()
        ) {
            return response()->json(['message' => 'You already have a pending clearance request'], 400);
        }

        $approvals = [
            'department_head' => null,
            'library' => null,
            'cafeteria' => null,
            'proctor' => null,
            'registrar' => null,
        ];
        $clearanceRequest = ClearanceRequest::create([
            'student_id' => $student_id,
            'sex' => $validatedData['sex'],
            'status' => 'pending',
            'year' => $validatedData['year'],
            'semester' => $validatedData['semester'],
            'section' => $validatedData['section'],
            'department_id' => $student->department_id, // foreign key
            'academic_year' => $validatedData['academic_year'],
            'last_day_class_attended' => $validatedData['last_day_class_attended'],
            'reason_for_clearance' => $validatedData['reason_for_clearance'],
            'cafe_status' => $validatedData['cafe_status'],
            'dorm_status' => $validatedData['dorm_status'],
            'archived' => false,
        ]);

        return response()->json([
            'message' => 'Clearance request submitted successfully',
            'clearanceRequest' => $clearanceRequest
        ], 201);
    }

    public function index(Request $request)
    {
        $staffRole = $request->query('staff_role'); // Get the role from the query param

        $roleToStep = [
            "department_head" => "department_head",
            "library" => "library",
            "cafeteria" => "cafeteria",
            "proctor" => "proctor",
            "registrar" => "registrar",
        ];

        if (!isset($roleToStep[$staffRole])) {
            return response()->json(["message" => "Invalid staff role"], 400);
        }

        $clearanceRequests = ClearanceRequest::where("current_step", $roleToStep[$staffRole])
            ->where("status", "!=", "rejected") // Exclude rejected requests
            ->with(['student', 'student.user','department']) // Load student and user details
            ->orderBy('created_at', 'desc')
            ->get();

        if ($clearanceRequests->isEmpty()) {
            return response()->json(['message' => 'No clearance request found'], 404);
        }
        return response()->json([
            "message" => "Clearance requests fetched successfully",
            "data" => $clearanceRequests
        ], 200);
    }

    // public function approveClearance(Request $request, $id)
    // {
    //     $request->validate([
    //         'staff_role' => 'required|string', // Example: 'department_head', 'library'
    //         'status' => 'required|in:approved,rejected',
    //         'remarks' => 'nullable|string',
    //     ]);

    //     $clearanceRequest = ClearanceRequest::findOrFail($id);

    //     // Retrieve existing approvals or initialize an empty array
    //     $approvals = $clearanceRequest->approvals ?? [];

    //     // Update the approval status for this department
    //     $approvals[$request->staff_role] = [
    //         'status' => $request->status,
    //         'remarks' => $request->remarks,
    //         'timestamp' => now(),
    //     ];

    //     $clearanceRequest->approvals = $approvals;

    //     // List of required departments
    //     $requiredDepartments = ['department_head', 'library', 'cafeteria', 'proctor', 'registrar_office'];

    //     // Check if all departments have approved
    //     $allApproved = true;
    //     foreach ($requiredDepartments as $dept) {
    //         if (!isset($approvals[$dept]) || $approvals[$dept]['status'] !== 'approved') {
    //             $allApproved = false;
    //             break;
    //         }
    //     }

    //     // Update the overall clearance status
    //     $clearanceRequest->status = $allApproved ? 'approved' : 'pending';

    //     // If any department rejects, set status to rejected
    //     if ($request->status === 'rejected') {
    //         $clearanceRequest->status = 'rejected';
    //     }

    //     $clearanceRequest->save();


    //     return response()->json(["message" => "Clearance updated successfully"]);
    // }

    public function approveClearance(Request $request, $id)
    {
        $request->validate([
            'staff_role' => 'required|string', // Example: 'department_head', 'library'
            'status' => 'required|in:approved,rejected',
            'remarks' => 'nullable|string',

        ]);

        $clearanceRequest = ClearanceRequest::findOrFail($id);

        $userId = Auth::id();
        // Retrieve existing approvals or initialize an empty array
        $approvals = $clearanceRequest->approvals ?? [];

        // Update the approval status for this department
        $approvals[$request->staff_role] = [
            'status' => $request->status,
            'remarks' => $request->remarks,
            'timestamp' => now(),
            'approved_by' => $userId
        ];

        $clearanceRequest->approvals = $approvals;

        // Set the individual boolean column dynamically
        $booleanColumn = $request->staff_role . '_approved';
        if (Schema::hasColumn('clearance_requests', $booleanColumn)) {
            if ($request->status === 'approved') {
                $clearanceRequest->{$booleanColumn} = true;
            } elseif ($request->status === 'rejected') {
                $clearanceRequest->{$booleanColumn} = false;
            }
        }

        // Handle next step logic only if approved
        if ($request->status === 'approved') {
            $steps = ['department_head', 'library', 'cafeteria', 'proctor', 'registrar'];
            $currentIndex = array_search($request->staff_role, $steps);

            // If not the last step, move to the next
            if ($currentIndex !== false && $currentIndex < count($steps) - 1) {
                $clearanceRequest->current_step = $steps[$currentIndex + 1];
            }

            // If it's the last step and approved, mark current_step as all_approved
            if ($currentIndex === count($steps) - 1) {
                $clearanceRequest->current_step = 'all_approved';
            }
        }

        // If rejected, we stop the flow and mark status as rejected
        if ($request->status === 'rejected') {
            $clearanceRequest->status = 'rejected';
        } else {
            // Check if all approvals are done
            $requiredDepartments = ['department_head', 'library', 'cafeteria', 'proctor', 'registrar'];
            $allApproved = true;
            foreach ($requiredDepartments as $dept) {
                if (!isset($approvals[$dept]) || $approvals[$dept]['status'] !== 'approved') {
                    $allApproved = false;
                    break;
                }
            }

            $clearanceRequest->status = $allApproved ? 'approved' : 'pending';
        }

        $clearanceRequest->save();

        return response()->json(["message" => "Clearance updated successfully"]);
    }

    public function display()
    {
        $clearanceRequests = ClearanceRequest::all();
        return response()->json($clearanceRequests->load(['student', 'student.user']));
    }
}
