<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function updateProfilePicture(Request $request)
    {
        $request->validate([
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $authUser = Auth::user();
        $user = User::find($authUser->id);

        if ($request->hasFile('profile_image')) {
            // Optional: delete old image
            if ($user->profile_image) {
                Storage::delete($user->profile_image);
            }

            $path = $request->file('profile_image')->store('profile_images', 'public');
            $user->profile_image = $path;
        }

        $user->save();

        return response()->json([
            'message' => 'Profile picture updated successfully.',
            'profile_image_url' => $user->profile_image
                ? asset('storage/' . $user->profile_image)
                : null,
        ]);
    }
    public function updateProfile(Request $request)
    {
        Log::info($request);
        $authUser = Auth::user();
        $user = User::find($authUser->id); // Ensure $user is an Eloquent model instance

        $request->validate([
            'name' => 'nullable|string|max:255',
            'username' => 'nullable|string|max:255|unique:users,username,' . $user->id,
            'email' => 'nullable|email|unique:users,email,' . $user->id,
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

        if ($request->hasFile('profileImage')) {
            if ($user->profile_image && Storage::exists(str_replace(asset('storage') . '/', '', $user->profile_image))) {
                Storage::delete(str_replace(asset('storage') . '/', '', $user->profile_image));
            }

            $path = $request->file('profileImage')->store('profile_images', 'public');
            $user->profile_image = asset('storage/' . $path); // Store full URL in the DB
        }

        $user->save();

        return response()->json(['message' => 'Profile updated successfully', 'user' => $user]);
    }
}
