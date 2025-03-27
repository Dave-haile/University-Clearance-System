<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Staff;
use App\Models\Student;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $studentUser = User::create([
            'name' => 'John Doe',
            'username' => 'john@student.com',
            'password' => bcrypt('password'),
            'role' => 'student'
        ]);

        Student::create([
            'user_id' => $studentUser->id,
            'student_id' => 'STU123',
            'department' => 'Computer Science',
            'year' => '3rd Year'
        ]);

        $staffUser = User::create([
            'name' => 'Jane Smith',
            'username' => 'jane@staff.com',
            'password' => bcrypt('password'),
            'role' => 'staff'
        ]);

        Staff::create([
            'user_id' => $staffUser->id,
            'position' => 'Lecturer',
            'department' => 'IT Department'
        ]);

        $adminUser = User::create([
            'name' => 'Admin Boss',
            'username' => 'admin@university.com',
            'password' => bcrypt('adminpass'),
            'role' => 'admin'
        ]);

        Admin::create([
            'user_id' => $adminUser->id,
            'admin_code' => 'ADMIN001'
        ]);
    }
}
