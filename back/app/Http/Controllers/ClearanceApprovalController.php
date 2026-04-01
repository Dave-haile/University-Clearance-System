<?php

namespace App\Http\Controllers;

use App\Models\ClearanceApproval;
use App\Models\ClearanceRequest;
use App\Services\ApiCacheService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClearanceApprovalController extends Controller
{
    public function __construct(private ApiCacheService $apiCache) {}
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $staff = Auth::user();
        if (!$staff) {
            return response()->json(["message" => "Unauthorized"], 403);
        }
        $request->validate([
            "status" => "required|in:approved,rejected",
            "remarks" => "nullable|string",
        ]);
        $clearanceRequest = ClearanceRequest::find($id);
        if (!$clearanceRequest) {
            return response()->json(
                ["message" => "Clearance request not found"],
                404,
            );
        }
        $department =
            $staff->role === "library_staff" ? "library" : $staff->role;
        if ($clearanceRequest->current_step !== $department) {
            return response()->json(
                ["message" => "Not your turn to approve this request"],
                403,
            );
        }
        $approval = ClearanceApproval::where("clearance_request_id", $id)
            ->where("department", $department)
            ->first();
        if (!$approval) {
            return response()->json(
                ["message" => "Approval record not found"],
                404,
            );
        }
        $approval->update([
            "status" => $request->status,
            "remarks" => $request->remarks,
            "staff_id" => $staff->staff->id, // Record who approved/rejected
        ]);
        if ($request->status === "rejected") {
            $clearanceRequest->update(["status" => "rejected"]);

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
                "message" => "Clearance request rejected",
                "clearance_request" => $clearanceRequest,
            ]);
        }
        $nextStep = $this->getNextStep($clearanceRequest);
        $clearanceRequest->update([
            "current_step" => $nextStep,
            "status" => $nextStep === null ? "approved" : "pending", // Mark approved if no next step
        ]);
        // $allApproved = ClearanceApproval::where('clearance_request_id', $id)->where('status', 'pending')->count() === 0;
        // if ($allApproved) {
        //     $clearanceRequest = ClearanceRequest::find($id);
        //     $clearanceRequest->update(['status' => 'approved']);
        // }
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
            "message" => "Clearance status updated successfully",
            "approval" => $approval,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
    private function getNextStep($clearanceRequest)
    {
        $steps = ["department_head", "library", "proctor", "registrar"];

        // If student is in cafeteria, add it to the process
        if ($clearanceRequest->cafe_status === "cafe") {
            array_splice($steps, 3, 0, "cafeteria"); // Insert cafeteria before registrar
        }

        $currentIndex = array_search($clearanceRequest->current_step, $steps);
        return $steps[$currentIndex + 1] ?? null; // Return next step or null if done
    }
}
