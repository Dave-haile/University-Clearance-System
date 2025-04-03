<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StaffTableSeeder extends Seeder
{
    public function run()
    {
        $computerScienceId = DB::table('departments')->where('department', 'Computer Science')->value('id');
        $libraryId = DB::table('departments')->where('department', 'Business Administration')->value('id'); 

        $staff = [
            [
                'user_id' => DB::table('users')->insertGetId([
                    'name' => 'Dr. John Doe',
                    'username' => 'cs_head',
                    'password' => Hash::make('password123'),
                    'role' => 'department_head',
                ]),
                'position' => 'department_head',
                'department_id' => $computerScienceId,
                'role' => 'department_head',
            ],
            [
                'user_id' => DB::table('users')->insertGetId([
                    'name' => 'Jane Smith',
                    'username' => 'library_staff',
                    'password' => Hash::make('password123'),
                    'role' => 'library',
                ]),
                'position' => 'library',
                'department_id' => $libraryId,
                'role' => 'library',
            ],
            [
                'user_id' => DB::table('users')->insertGetId([
                    'name' => 'Mike Johnson',
                    'username' => 'cafeteria_staff',
                    'password' => Hash::make('password123'),
                    'role' => 'cafeteria',
                ]),
                'position' => 'cafeteria',
                'department_id' => null,
                'role' => 'cafeteria',
            ],
        ];

        DB::table('staff')->insert($staff);
    }
}
