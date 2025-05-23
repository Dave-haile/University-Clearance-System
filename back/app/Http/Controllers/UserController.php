<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function updateProfilePicture(Request $request)
    {
        $request->validate([
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $user = auth()->user();

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
        $user = auth()->user();

        $request->validate([
            'name' => 'nullable|string|max:255',
            'username' => 'nullable|string|max:255|unique:users,username,' . $user->id,
            'email' => 'nullable|email|unique:users,email,' . $user->id,
        ]);

        $user->name = $request->name;
        $user->username = $request->username;

        if ($request->filled('email')) {
            $user->email = $request->email;
        }

        $user->save();

        return response()->json(['message' => 'Profile updated successfully']);
    }
}
