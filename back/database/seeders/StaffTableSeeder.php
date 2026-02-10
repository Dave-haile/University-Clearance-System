<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;

class StaffTableSeeder extends Seeder
{
    public function run()
    {
        $imageDirectory = public_path('profiles');
        $images = File::files($imageDirectory);
        if (count($images) === 0) {
            $imageUrl = null;
        } else {
            $randomImage = collect($images)->random();
            $imageUrl = url('profiles/' . $randomImage->getFilename());
        }
        // $computerScienceId = DB::table('departments')->where('department', 'Computer Science')->value('id');

        $staff = [
            [
                'user_id' => DB::table('users')->insertGetId([
                    'name' => 'Jane Smith',
                    'email' => 'hello@gmail.com',
                    'password' => Hash::make('password123'),
                    'role' => 'library',
                    'profile_image' => $imageUrl,
                ]),
                'position' => 'library',
                'department_id' => null,
                'role' => 'library',
            ],
            [
                'user_id' => DB::table('users')->insertGetId([
                    'name' => 'Mike Johnson',
                    'email' => 'byee@gmail.com',
                    'password' => Hash::make('password123'),
                    'role' => 'cafeteria',
                    'profile_image' => $imageUrl,
                ]),
                'position' => 'cafeteria',
                'department_id' => null,
                'role' => 'cafeteria',
            ],
            [
                'user_id' => DB::table('users')->insertGetId([
                    'name' => 'Sarah Brown',
                    'email' => 'heylo@gmail.com',
                    'password' => Hash::make('password123'),
                    'role' => 'proctor',
                    'profile_image' => $imageUrl,
                ]),
                'position' => 'proctor',
                'department_id' => null,
                'role' => 'proctor',
            ],
            [
                'user_id' => DB::table('users')->insertGetId([
                    'name' => 'Emily Davis',
                    'email' => 'emily33@gmail.com',
                    'password' => Hash::make('password123'),
                    'role' => 'registrar',
                    'profile_image' => $imageUrl,
                ]),
                'position' => 'registrar',
                'department_id' => null,
                'role' => 'registrar',
            ],
            [
                'user_id' => DB::table('users')->insertGetId([
                    'name' => 'David Wilson',
                    'email' => 'david@gmail.com',
                    'password' => Hash::make('password123'),
                    'role' => 'library',
                    'profile_image' => $imageUrl,
                ]),
                'position' => 'library',
                'department_id' => null,
                'role' => 'library',
            ],
            [
                'user_id' => DB::table('users')->insertGetId([
                    'name' => 'John Doe',
                    'email' => 'does@gmail.com',
                    'password' => Hash::make('password123'),
                    'role' => 'cafeteria',
                    'profile_image' => $imageUrl,
                ]),
                'position' => 'cafeteria',
                'department_id' => null,
                'role' => 'cafeteria',
            ],
            [
                'user_id' => DB::table('users')->insertGetId([
                    'name' => 'Alice Green',
                    'email' => 'green@gmail.com',
                    'password' => Hash::make('password123'),
                    'role' => 'proctor',
                    'profile_image' => $imageUrl,
                ]),
                'position' => 'proctor',
                'department_id' => null,
                'role' => 'proctor',
            ],
            [
                'user_id' => DB::table('users')->insertGetId([
                    'name' => 'Chris White',
                    'email' => 'chris@gmail.com',
                    'password' => Hash::make('password123'),
                    'role' => 'registrar',
                    'profile_image' => $imageUrl,
                ]),
                'position' => 'registrar',
                'department_id' => null,
                'role' => 'registrar',
            ],
        ];

        DB::table('staff')->insert($staff);
    }
}
