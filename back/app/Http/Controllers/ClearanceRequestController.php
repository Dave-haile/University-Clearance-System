<?php

namespace App\Http\Controllers;

use App\Http\Requests\ClearanceRequestRequest;
use App\Models\ClearanceRequest;
use App\Models\Student;
use App\Services\ApiCacheService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClearanceRequestController extends Controller
{
    public function __construct(private ApiCacheService $apiCache) {}
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
        $student = Student::where("user_id", $user->id)->first();

        if (!$student) {
            return response()->json(["message" => "student not found"]);
        }
        if (!$student->department_id) {
            return response()->json(
                ["message" => "Student department not found"],
                400,
            );
        }

        $student_id = $student->student_id;

        $validatedData = $request->validated();

        if (!isset($validatedData["sex"])) {
            return response()->json(
                ["message" => "Sex field is required"],
                400,
            );
        }

        // Check if the student already has a pending request
        if (
            ClearanceRequest::where("student_id", $student_id)
                ->where("status", "pending")
                ->where("archived", false)
                ->exists()
        ) {
            return response()->json(
                ["message" => "You already have a pending clearance request"],
                400,
            );
        }

        $clearanceRequest = ClearanceRequest::create([
            "student_id" => $student_id,
            "sex" => $validatedData["sex"],
            "status" => "pending",
            "year" => $validatedData["year"],
            "semester" => $validatedData["semester"],
            "section" => $validatedData["section"],
            "department_id" => $student->department_id, // foreign key
            "academic_year" => $validatedData["academic_year"],
            "last_day_class_attended" =>
                $validatedData["last_day_class_attended"],
            "reason_for_clearance" => $validatedData["reason_for_clearance"],
            "cafe_status" => $validatedData["cafe_status"],
            "dorm_status" => $validatedData["dorm_status"],
            "current_step" => "department_head",
            "approvals" => $this->defaultApprovals(),
            "archived" => false,
        ]);

        $this->apiCache->bump([
            "clearance_requests",
            "student_clearance_requests",
            "student_dashboard",
            "student_all_data",
            "staff_queue",
            "staff_display_requests",
            "staff_dashboard",
            "admin_dashboard",
            "admin_clearance_requests",
            "users",
            "students",
            "departments",
            "user:" . $user->id,
            "department:" . $student->department_id,
        ]);

        return response()->json(
            [
                "message" => "Clearance request submitted successfully",
                "clearanceRequest" => $clearanceRequest,
            ],
            201,
        );
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        if (!$user || !$user->staff) {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        $staffRole = $this->normalizeStaffRole($user->role);
        $requestedRole = $this->normalizeStaffRole($request->query("staff_role"));
        if (!$staffRole || ($requestedRole && $requestedRole !== $staffRole)) {
            return response()->json(["message" => "Invalid staff role"], 400);
        }

        $query = ClearanceRequest::with(["student.user", "student.department", "department"])
            ->where("current_step", $staffRole)
            ->where("archived", false)
            ->where("status", "pending");

        if ($staffRole === "department_head") {
            $query->where("department_id", $user->staff->department_id);
        }

        $clearanceRequests = $query->orderByDesc("created_at")->get();

        return response()->json([
            "message" => "Clearance requests fetched successfully",
            "data" => $clearanceRequests,
        ]);
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
        $user = Auth::user();
        if (!$user || !$user->staff) {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        $request->validate([
            "staff_role" => "required|string",
            "status" => "required|in:approved,rejected",
            "remarks" => "nullable|string",
        ]);

        $staffRole = $this->normalizeStaffRole($user->role);
        $requestedRole = $this->normalizeStaffRole($request->staff_role);
        if (!$staffRole || $requestedRole !== $staffRole) {
            return response()->json(["message" => "Invalid staff role"], 403);
        }

        $clearanceRequest = ClearanceRequest::with(["student.user", "student.department", "department"])->findOrFail($id);

        if ($clearanceRequest->archived) {
            return response()->json(["message" => "Archived requests cannot be processed"], 422);
        }

        if ($clearanceRequest->status !== "pending") {
            return response()->json(["message" => "This request has already been finalized"], 422);
        }

        if ($clearanceRequest->current_step !== $staffRole) {
            return response()->json(["message" => "Not your turn to approve this request"], 403);
        }

        if (
            $staffRole === "department_head" &&
            (int) $clearanceRequest->department_id !== (int) $user->staff->department_id
        ) {
            return response()->json(["message" => "You can only review requests from your own department"], 403);
        }

        $approvals = is_array($clearanceRequest->approvals)
            ? $clearanceRequest->approvals
            : $this->defaultApprovals();

        $approvals[$staffRole] = [
            "status" => $request->status,
            "remarks" => $request->remarks,
            "timestamp" => now(),
            "approved_by" => $user->id,
        ];

        $clearanceRequest->approvals = $approvals;

        $booleanColumn = $staffRole . "_approved";
        if (
            in_array(
                $booleanColumn,
                [
                    "department_head_approved",
                    "library_approved",
                    "cafeteria_approved",
                    "proctor_approved",
                    "registrar_approved",
                ],
                true,
            )
        ) {
            $clearanceRequest->{$booleanColumn} =
                $request->status === "approved";
        }

        if ($request->status === "rejected") {
            $clearanceRequest->status = "rejected";
        } else {
            $nextStep = $this->getNextStep($staffRole);
            $clearanceRequest->current_step = $nextStep ?? "all_approved";
            $clearanceRequest->status = $nextStep ? "pending" : "approved";
        }

        $clearanceRequest->save();

        $clearanceRequest->refresh();

        $this->apiCache->bump([
            "clearance_requests",
            "student_clearance_requests",
            "student_dashboard",
            "student_all_data",
            "staff_queue",
            "staff_display_requests",
            "staff_dashboard",
            "admin_dashboard",
            "admin_clearance_requests",
            "users",
            "students",
            "departments",
            "user:" . $clearanceRequest->student?->user_id,
            "department:" . $clearanceRequest->department_id,
        ]);

        return response()->json([
            "message" => "Clearance updated successfully",
            "data" => $clearanceRequest,
        ]);
    }

    private function normalizeStaffRole(?string $role): ?string
    {
        return in_array(
            $role,
            ["department_head", "library", "cafeteria", "proctor", "registrar"],
            true,
        )
            ? $role
            : null;
    }

    private function getNextStep(string $currentRole): ?string
    {
        $steps = [
            "department_head",
            "library",
            "cafeteria",
            "proctor",
            "registrar",
        ];

        $currentIndex = array_search($currentRole, $steps, true);

        if ($currentIndex === false) {
            return null;
        } else {
            return $steps[$currentIndex + 1] ?? null;
        }
    }

    private function defaultApprovals(): array
    {
        $emptyApproval = [
            "status" => "pending",
            "remarks" => null,
            "timestamp" => null,
            "approved_by" => null,
        ];

        return [
            "department_head" => $emptyApproval,
            "library" => $emptyApproval,
            "cafeteria" => $emptyApproval,
            "proctor" => $emptyApproval,
            "registrar" => $emptyApproval,
        ];
    }

    public function display()
    {
        $clearanceRequests = $this->apiCache->remember(
            [
                "public_clearance_requests",
                "clearance_requests",
                "students",
                "users",
            ],
            "clearance.display",
            180,
            function () {
                return ClearanceRequest::with([
                    "student",
                    "student.user",
                ])->get();
            },
        );

        return response()->json($clearanceRequests);
    }
}
