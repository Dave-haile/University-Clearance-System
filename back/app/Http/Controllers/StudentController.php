<?php

namespace App\Http\Controllers;

use App\Models\ClearanceRequest;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $user = Auth::user();

        $user = User::where('id',$user->id)
        ->with('student.clearance_requests','student.department')
        ->get()
        ;

        return response()->json($user);
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
    public function show()
    {
        $user = Auth::user();

        $student = Student::where('user_id', $user->id)->first();

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $clearaceRequest = ClearanceRequest::where('student_id', $student->student_id)
            ->where('archived', false)
            ->orderBy('created_at', 'desc')
            ->get();

        $ArchivedClearaceRequest = ClearanceRequest::where('student_id', $student->student_id)
            ->where('archived', true)
            ->orderBy('created_at', 'desc')
            ->get();
        if (!$clearaceRequest) {
            return response()->json(['message' => 'No clearance request found'], 404);
        }
        
        return response()->json($clearaceRequest->load('student.user'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
