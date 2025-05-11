<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\ClearanceRequest;
use App\Models\Department;
use App\Models\Staff;
use App\Models\Student;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */

    public function run(): void
    {
        $imageDirectory = public_path('profiles');
        $images = File::files($imageDirectory);
        if (count($images) === 0) {
            $imageUrl = null;
        } else {
            $randomImage = collect($images)->random();
            $imageUrl = url('profiles/' . $randomImage->getFilename());
        }
        $this->call([
            DepartmentsTableSeeder::class,
            StaffTableSeeder::class,
        ]);
        $department = Department::where('department', 'Computer Science')->first();

        $studentUser = User::create([
            'name' => 'John Doe',
            'username' => 'INUSR022113',
            'password' => bcrypt('password'),
            'role' => 'student',
            'profile_image' => $imageUrl,
        ]);

        Student::create([
            'user_id' => $studentUser->id,
            'student_id' => 'INUSR/0221/13',
            'department_id' => $department?->id,
            'year' => '3rd Year'
        ]);
        $adminUser = User::create([
            'name' => 'Dawit Haile',
            'email' => 'admin@university.com',
            'password' => bcrypt('adminpass'),
            'role' => 'admin',
            'profile_image' => $imageUrl,
        ]);

        Admin::create([
            'user_id' => $adminUser->id,
            'admin_code' => 'ADMIN001'
        ]);
        User::factory(10)->create();

        Student::factory(20)->create();

        Staff::factory(10)->create();

        ClearanceRequest::factory(15)->create();
    }
}
