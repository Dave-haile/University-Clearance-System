<?php

namespace App\Http\Controllers;

use App\Models\ClearanceApproval;
use App\Models\ClearanceRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClearanceApprovalController extends Controller
{
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
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'remarks' => 'nullable|string',
        ]);
        $clearanceRequest = ClearanceRequest::find($id);
        if (!$clearanceRequest) {
            return response()->json(['message' => 'Clearance request not found'], 404);
        }
        $department = $staff->staff->position;
        if ($clearanceRequest->current_step !== $department) {
            return response()->json(['message' => 'Not your turn to approve this request'], 403);
        }
        $approval = ClearanceApproval::where('clearance_request_id', $id)
            ->where('department', $department) 
            ->first();
        if (!$approval) {
            return response()->json(['message' => 'Approval record not found'], 404);
        }
        $approval->update([
            'status' => $request->status,
            'remarks' => $request->remarks,
            'staff_id' => $staff->staff->id, // Record who approved/rejected
        ]);
        if ($request->status === 'rejected') {
            $clearanceRequest->update(['status' => 'rejected']);
            return response()->json([
                'message' => 'Clearance request rejected',
                'clearance_request' => $clearanceRequest
            ]);
        }
        $nextStep = $this->getNextStep($clearanceRequest);
        $clearanceRequest->update([
            'current_step' => $nextStep,
            'status' => ($nextStep === null) ? 'approved' : 'pending', // Mark approved if no next step
        ]);
        // $allApproved = ClearanceApproval::where('clearance_request_id', $id)->where('status', 'pending')->count() === 0;
        // if ($allApproved) {
        //     $clearanceRequest = ClearanceRequest::find($id);
        //     $clearanceRequest->update(['status' => 'approved']);
        // }
        return response()->json([
            'message' => 'Clearance status updated successfully',
            'approval' => $approval,
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
        $steps = ['department_head', 'library', 'proctor', 'registrar'];

        // If student is in cafeteria, add it to the process
        if ($clearanceRequest->cafe_status === 'cafe') {
            array_splice($steps, 3, 0, 'cafeteria'); // Insert cafeteria before registrar
        }

        $currentIndex = array_search($clearanceRequest->current_step, $steps);
        return $steps[$currentIndex + 1] ?? null; // Return next step or null if done
    }
}
