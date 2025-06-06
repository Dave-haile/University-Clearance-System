<?php

namespace App\Http\Controllers;

use App\Models\ClearanceRequest;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;


class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // public function index()
    // {
    //     $authUser = Auth::user();

    //     // Get the user with student, department, and clearance_requests
    //     $user = User::where('id', $authUser->id)
    //         ->with('student.clearance_requests', 'student.department')
    //         ->first(); // use first() instead of get() since you're fetching a single user

    //     // If clearance request exists and has approvals
    //     if ($user->student && $user->student->clearance_requests) {
    //         $clearance = $user->student->clearance_requests;
    //         $approvals = $clearance->approvals;

    //         if (is_array($approvals)) {
    //             foreach ($approvals as $key => $approval) {
    //                 if (isset($approval['approved_by'])) {
    //                     $approver = User::find($approval['approved_by']);
    //                     $approvals[$key]['approved_by'] = $approver;
    //                 }
    //             }

    //             // Replace the original approvals with enriched version
    //             $user->student->clearance_requests->approvals = $approvals;
    //         }
    //     }

    //     return response()->json($user);
    // }
    public function index()
    {
        $authUser = Auth::user();
        $user = User::where('id', $authUser->id)
            ->with([
                'student.department',
                'student.clearance_requests' => function ($query) {
                    $query->where('archived', false)->orderByDesc('created_at');
                }
            ])
            ->first();
        if ($user->student && $user->student->clearance_requests->isNotEmpty()) {
            $user->student->clearance_requests->transform(function ($clearance) {
                $approvals = $clearance->approvals;

                if (is_array($approvals)) {
                    foreach ($approvals as $key => $approval) {
                        if (isset($approval['approved_by'])) {
                            $approver = User::find($approval['approved_by']);
                            $approvals[$key]['approved_by'] = $approver;
                        }
                    }

                    $clearance->approvals = $approvals;
                }

                return $clearance;
            });
        }

        return response()->json($user);
    }
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
    public function fetchAll()
    {
        $authUser = Auth::user();
        $user = User::where('id', $authUser->id)
            ->with([
                'student.department',
                'student.clearance_requests.department',
                'student.clearance_requests' => function ($query) {
                    $query->orderByDesc('created_at');
                }
            ])
            ->first();
        if ($user->student && $user->student->clearance_requests->isNotEmpty()) {
            $user->student->clearance_requests->transform(function ($clearance) {
                $approvals = $clearance->approvals;

                if (is_array($approvals)) {
                    foreach ($approvals as $key => $approval) {
                        if (isset($approval['approved_by'])) {
                            $approver = User::find($approval['approved_by']);
                            $approvals[$key]['approved_by'] = $approver;
                        }
                    }

                    $clearance->approvals = $approvals;
                }

                return $clearance;
            });
        }

        return response()->json($user);
    }
    public function showProfile()
    {
        $user = Auth::user();
        $user = User::where('id', $user->id)
            ->with('student.department')
            ->first();

        return response()->json($user);
    }
    public function updateProfile(Request $request)
    {
        $authUser = Auth::user();
        $user = User::find($authUser->id); // Ensure $user is an Eloquent model instance
        $request->validate([
            'name' => 'nullable|string|max:255',
            'username' => 'nullable|string|max:255|unique:users,username,' . $user->id,
            'email' => 'nullable|email|max:255|unique:users,email,' . $user->id,
            'oldPassword' => 'nullable|string',
            'new_password' => 'nullable|string|min:8|confirmed',
            'profileImage' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        if ($request->filled('name')) {
            $user->name = $request->name;
        }
        if ($request->filled('username')) {
            $user->username = $request->username;
        }
        if ($request->filled('email')) {
            $user->email = $request->email;
        }

        if ($request->filled('oldPassword') && $request->filled('new_password')) {
            if (!Hash::check($request->oldPassword, $user->password)) {
                return response()->json(['message' => 'Incorrect current password.'], 403);
            }

            $user->password = Hash::make($request->new_password);
        }
        if ($request->hasFile('profileImage')) {
            if ($user->profile_image && Storage::exists(str_replace(asset('storage') . '/', '', $user->profile_image))) {
                Storage::delete(str_replace(asset('storage') . '/', '', $user->profile_image));
            }

            $path = $request->file('profileImage')->store('profile_images', 'public');
            $user->profile_image = asset('storage/' . $path); // Store full URL in the DB
        }
        $user->save();
        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }
}
