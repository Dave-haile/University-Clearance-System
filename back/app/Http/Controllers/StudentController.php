<?php

namespace App\Http\Controllers;

use App\Models\ClearanceRequest;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use App\Services\ApiCacheService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class StudentController extends Controller
{
    public function __construct(private ApiCacheService $apiCache) {}
    public function index()
    {
        $authUser = Auth::user();

        $user = $this->apiCache->remember(
            [
                "student_dashboard",
                "users",
                "students",
                "departments",
                "clearance_requests",
                "user:" . $authUser->id,
            ],
            "student.index." . $authUser->id,
            180,
            function () use ($authUser) {
                $user = User::where("id", $authUser->id)
                    ->with([
                        "student.department",
                        "student.clearance_requests" => function ($query) {
                            $query
                                ->where("archived", false)
                                ->orderByDesc("created_at");
                        },
                    ])
                    ->first();

                if (
                    $user->student &&
                    $user->student->clearance_requests->isNotEmpty()
                ) {
                    $user->student->setRelation(
                        "clearance_requests",
                        $this->hydrateApprovalUsers(
                            $user->student->clearance_requests,
                        ),
                    );
                }

                return $user;
            },
        );

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

        $data = $this->apiCache->remember(
            [
                "student_clearance_requests",
                "students",
                "clearance_requests",
                "users",
                "user:" . $user->id,
            ],
            "student.show." . $user->id,
            180,
            function () use ($user) {
                $student = Student::where("user_id", $user->id)->first();

                if (!$student) {
                    return [
                        "status" => 404,
                        "data" => ["message" => "Student not found"],
                    ];
                }

                $clearaceRequest = ClearanceRequest::where(
                    "student_id",
                    $student->student_id,
                )
                    ->where("archived", false)
                    ->orderBy("created_at", "desc")
                    ->get();

                if ($clearaceRequest->isEmpty()) {
                    return [
                        "status" => 404,
                        "data" => ["message" => "No clearance request found"],
                    ];
                }

                return [
                    "status" => 200,
                    "data" => $clearaceRequest->load("student.user"),
                ];
            },
        );

        return response()->json($data["data"], $data["status"]);
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

        $user = $this->apiCache->remember(
            [
                "student_all_data",
                "users",
                "students",
                "departments",
                "clearance_requests",
                "user:" . $authUser->id,
            ],
            "student.fetch_all." . $authUser->id,
            180,
            function () use ($authUser) {
                $user = User::where("id", $authUser->id)
                    ->with([
                        "student.department",
                        "student.clearance_requests.department",
                        "student.clearance_requests" => function ($query) {
                            $query->orderByDesc("created_at");
                        },
                    ])
                    ->first();

                if (
                    $user->student &&
                    $user->student->clearance_requests->isNotEmpty()
                ) {
                    $user->student->setRelation(
                        "clearance_requests",
                        $this->hydrateApprovalUsers(
                            $user->student->clearance_requests,
                        ),
                    );
                }

                return $user;
            },
        );

        return response()->json($user);
    }
    public function showProfile()
    {
        $authUser = Auth::user();

        $user = $this->apiCache->remember(
            [
                "student_profile",
                "users",
                "students",
                "departments",
                "user:" . $authUser->id,
            ],
            "student.profile." . $authUser->id,
            300,
            function () use ($authUser) {
                return User::where("id", $authUser->id)
                    ->with("student.department")
                    ->first();
            },
        );

        return response()->json($user);
    }
    public function updateProfile(Request $request)
    {
        $authUser = Auth::user();
        $user = User::find($authUser->id); // Ensure $user is an Eloquent model instance
        $request->validate([
            "name" => "nullable|string|max:255",
            "username" =>
                "nullable|string|max:255|unique:users,username," . $user->id,
            "email" => "nullable|email|max:255|unique:users,email," . $user->id,
            "oldPassword" => "nullable|string",
            "new_password" => "nullable|string|min:8|confirmed",
            "profileImage" => "nullable|image|mimes:jpeg,png,jpg,gif|max:2048",
        ]);
        if ($request->filled("name")) {
            $user->name = $request->name;
        }
        if ($request->filled("username")) {
            $user->username = $request->username;
        }
        if ($request->filled("email")) {
            $user->email = $request->email;
        }

        if (
            $request->filled("oldPassword") &&
            $request->filled("new_password")
        ) {
            if (!Hash::check($request->oldPassword, $user->password)) {
                return response()->json(
                    ["message" => "Incorrect current password."],
                    403,
                );
            }

            $user->password = Hash::make($request->new_password);
        }
        if ($request->hasFile("profileImage")) {
            if (
                $user->profile_image &&
                Storage::exists(
                    str_replace(
                        asset("storage") . "/",
                        "",
                        $user->profile_image,
                    ),
                )
            ) {
                Storage::delete(
                    str_replace(
                        asset("storage") . "/",
                        "",
                        $user->profile_image,
                    ),
                );
            }

            $path = $request
                ->file("profileImage")
                ->store("profile_images", "public");
            $user->profile_image = asset("storage/" . $path); // Store full URL in the DB
        }
        $user->save();

        $this->apiCache->bump([
            "student_dashboard",
            "student_clearance_requests",
            "student_all_data",
            "student_profile",
            "admin_users",
            "users",
            "students",
            "user:" . $user->id,
        ]);

        return response()->json([
            "message" => "Profile updated successfully",
            "user" => $user,
        ]);
    }

    private function hydrateApprovalUsers(
        Collection|Model $clearanceRequests,
    ): Collection {
        if ($clearanceRequests instanceof Model) {
            $clearanceRequests = new Collection([$clearanceRequests]);
        }

        $approverIds = $clearanceRequests
            ->flatMap(function ($clearance) {
                $approvals = is_array($clearance->approvals)
                    ? $clearance->approvals
                    : [];

                return collect($approvals)->pluck("approved_by")->filter();
            })
            ->unique()
            ->values();

        if ($approverIds->isEmpty()) {
            return $clearanceRequests;
        }

        $approvers = User::whereIn("id", $approverIds)->get()->keyBy("id");

        return $clearanceRequests->transform(function ($clearance) use (
            $approvers,
        ) {
            $approvals = is_array($clearance->approvals)
                ? $clearance->approvals
                : [];

            foreach ($approvals as $key => $approval) {
                if (isset($approval["approved_by"])) {
                    $approvals[$key]["approved_by"] = $approvers->get(
                        $approval["approved_by"],
                    );
                }
            }

            $clearance->approvals = $approvals;

            return $clearance;
        });
    }
}
