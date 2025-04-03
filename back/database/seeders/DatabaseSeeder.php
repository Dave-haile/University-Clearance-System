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
            'username' => 'INUSR022113',
            'password' => bcrypt('password'),
            'role' => 'student'
        ]);

        Student::create([
            'user_id' => $studentUser->id,
            'student_id' => 'STU123',
            'department' => 'Computer Science',
            'year' => '3rd Year'
        ]);

        // $staffUser = User::create([
        //     'name' => 'Jane Smith',
        //     'username' => 'jane@staff.com',
        //     'password' => bcrypt('password'),
        //     'role' => 'staff'
        // ]);
        // $departments = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering'];
        // foreach ($departments as $name) {
        //     $departmentID = Department::create(['name' => $name]);
        //     Staff::create([
        //         'user_id' => $staffUser->id,
        //         'position' => 'Lecturer',
        //         'department' => 'IT Department',
        //         'department_id' => $departmentID->id,
        //         'role' => 'library'
        //     ]);
        // }

        // $adminUser = User::create([
        //     'name' => 'Admin Boss',
        //     'username' => 'admin@university.com',
        //     'password' => bcrypt('adminpass'),
        //     'role' => 'admin'
        // ]);

        // Admin::create([
        //     'user_id' => $adminUser->id,
        //     'admin_code' => 'ADMIN001'
        // ]);
        $this->call([
            DepartmentsTableSeeder::class,
            StaffTableSeeder::class,
        ]);
        // Department::factory(5)->create();

        // Create users and their corresponding student/staff records
        User::factory(10)->has(Student::factory())->create(); // 10 students
        // User::factory(5)->has(Staff::factory())->create(); // 5 staff members

        // Create 15 clearance requests
        ClearanceRequest::factory(15)->create();
    }
}
