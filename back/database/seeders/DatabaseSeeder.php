<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Department;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $imageDirectory = public_path('profiles');
        $images = File::files($imageDirectory);
        $imageUrl = count($images)
            ? url('profiles/' . collect($images)->random()->getFilename())
            : null;

        $this->call([
            DepartmentsTableSeeder::class,
            StaffTableSeeder::class,
        ]);

        $department = Department::where('department', 'Computer Science')->first();

        // ✅ Create fixed Student user
        $studentUser = User::create([
            'name' => 'John Doe',
            'username' => 'INUSR022113',
            'email' => 'john.doe@example.com',
            'email_verified_at' => now(),
            'password' => bcrypt('password'),
            'role' => 'student',
            'profile_image' => $imageUrl,
            'remember_token' => null,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        Student::create([
            'user_id' => $studentUser->id,
            'student_id' => 'INUSR/0221/13',
            'department_id' => $department?->id,
            'year' => '3rd Year'
        ]);

        // ✅ Create fixed Admin user
        $adminUser = User::create([
            'name' => 'Dawit Haile',
            'username' => 'admin',
            'email' => 'admin@university.com',
            'email_verified_at' => now(),
            'password' => bcrypt('adminpass'),
            'role' => 'admin',
            'profile_image' => $imageUrl,
            'remember_token' => null,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        Admin::create([
            'user_id' => $adminUser->id,
            'admin_code' => 'ADMIN001'
        ]);

        // 🚫 REMOVE factories
        // User::factory(5)->create();
        // Student::factory(15)->create();
        // Staff::factory(6)->create();
        // ClearanceRequest::factory(15)->create();

        // ✅ Insert arrays instead with consistent fields
        $users = [
            [
                'name' => "Audra O'Reilly",
                'username' => null,
                'email' => 'donnelly.charley@example.com',
                'email_verified_at' => now(),
                'password' => '$2y$12$TQuXHzMRecJZua8NN70fNOcWZCeYkK79n7dbZIAt56A66dczuudpq',
                'role' => 'department_head',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Vilma Schiller',
                'username' => null,
                'email' => 'eryn.hegmann@example.org',
                'email_verified_at' => null,
                'password' => '$2y$12$lBCUOcsqhXX5Wv11NU/fh.uCilm47qiupgHerkIT3KAAA6lv54/k.',
                'role' => 'department_head',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Albina Bashirian I',
                'username' => null,
                'email' => 'clementina64@example.com',
                'email_verified_at' => null,
                'password' => '$2y$12$kI6tQ7hGSsqqlPT3t9PzAuaKXdVOs7ysyfhHsQc.39DKCQn7eeUoW',
                'role' => 'department_head',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Angie Connelly',
                'username' => null,
                'email' => 'juliet.keebler@example.com',
                'email_verified_at' => null,
                'password' => '$2y$12$OsSXumpMorGS/ZZxcxNoJu5HrVgxTOIys4Ph66Ze2JUP1da3iz1kW',
                'role' => 'department_head',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Miles Hamill',
                'username' => null,
                'email' => 'jimmie03@example.net',
                'email_verified_at' => null,
                'password' => '$2y$12$OSPCDB6RjRppb6Ltrqg5pebpjF8g5FKa/ANJ44asylCWL7cpVrGji',
                'role' => 'department_head',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Alexandrine Thompson',
                'username' => null,
                'email' => 'freida06@example.org',
                'email_verified_at' => null,
                'password' => '$2y$12$e8MdQIQkYNOqV0Vt8OdMeuDce9JF0HmLL1brir88wtbQDFxp3PzpS',
                'role' => 'department_head',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Mariah Ullrich',
                'username' => null,
                'email' => 'emelia.kerluke@example.org',
                'email_verified_at' => null,
                'password' => '$2y$12$.IdE4P.IAL9eNry6u8JsSO38bFL87DZGwW.H4kLTWySo5c8EVWB9a',
                'role' => 'department_head',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Paula Jones',
                'username' => null,
                'email' => 'jordy.armstrong@example.org',
                'email_verified_at' => null,
                'password' => '$2y$12$sAXq3pJHL.wQqwEecRBjyOMatDPqDxCsI4NzjxPsh.BwaM102TZ0i',
                'role' => 'department_head',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Dr. Rosella Balistreri',
                'username' => null,
                'email' => 'kathleen.mcdermott@example.org',
                'email_verified_at' => null,
                'password' => '$2y$12$E5guBbAmtpnCPlDo.uNADOiPS.rdruz9d5IvDqWq2ZjidhOptHEOy',
                'role' => 'department_head',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Jane Smith',
                'username' => null,
                'email' => 'Jane23@gmail.com',
                'email_verified_at' => null,
                'password' => '$2y$12$CJHL.issVYH7fQoB1/B94eXKepK4Ukc3aMQ4z0MU29rPlp6yFc49y',
                'role' => 'library',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => null,
                'updated_at' => null
            ],
            [

                'name' => 'Mike Johnson',
                'username' => null,
                'email' => 'byee23@gmail.com',
                'email_verified_at' => null,
                'password' => '$2y$12$w4P/nXpiQKjxZ3YoRao32uETBGkhP0w2MZGZO9s.O1SZTV/ZfS4JG',
                'role' => 'cafeteria',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => null,
                'updated_at' => null
            ],
            [

                'name' => 'Sarah Brown',
                'username' => null,
                'email' => 'heylo23@gmail.com',
                'email_verified_at' => null,
                'password' => '$2y$12$bt5djvXSlJ15pakX/0zIOO2NMPIzEE82g.B42P1ngLfGhN/Q/itX2',
                'role' => 'proctor',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => null,
                'updated_at' => null
            ],
            [

                'name' => 'Emily Davis',
                'username' => null,
                'email' => 'emily23@gmail.com',
                'email_verified_at' => null,
                'password' => '$2y$12$nc1EtNnx5AuzTTPlcZb5rufucAB7Fdbx5MlVtrgzZ6S/uQF.IZ.AG',
                'role' => 'registrar',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => null,
                'updated_at' => null
            ],
            [

                'name' => 'David Wilson',
                'username' => null,
                'email_verified_at' => null,
                'password' => '$2y$12$4tHotYdM8gQfYm9xRoqpSO4SxPefa702dBVSvOEH/DAB.QK7KkyF.',
                'role' => 'library',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => null,
                'updated_at' => null
            ],
            [

                'name' => 'John Doe',
                'username' => null,
                'email' => 'does23@gmail.com',
                'email_verified_at' => null,
                'password' => '$2y$12$OffgSQOPbPU0U5vYReWmLegwi3jBm19qtyYEiWUyCXcesEOf0yfpq',
                'role' => 'cafeteria',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => null,
                'updated_at' => null
            ],
            [

                'name' => 'Alice Green',
                'username' => null,
                'email' => 'green23@gmail.com',
                'email_verified_at' => null,
                'password' => '$2y$12$KnJ55c.ig.nGgAu.VFeRL.hZs/vuR.BGqWsRqPQDUouzq7hj6Totq',
                'role' => 'proctor',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => null,
                'updated_at' => null
            ],
            [

                'name' => 'Chris White',
                'username' => null,
                'email' => 'chris23@gmail.com',
                'email_verified_at' => null,
                'password' => '$2y$12$JvqKkSOcayPqPrBMAMJ4WeFDVbT3kVgPIkDF0KI5z1aUcJX.cDf0q',
                'role' => 'registrar',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => null,
                'updated_at' => null
            ],
            [

                'name' => 'Mrs. Dianna Rice',
                'username' => 'dianna.rice',
                'email' => 'dianna.rice@example.com',
                'email_verified_at' => now(),
                'password' => '$2y$12$Zd0SDJ8bJJ4DpLLsJrXU4eOwn1B2lbzrY9zH66cWuDvTXn6E5Oz5u',
                'role' => 'student',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Zetta Casper MD',
                'username' => 'zetta.casper',
                'email' => 'zetta.casper@example.com',
                'email_verified_at' => now(),
                'password' => '$2y$12$Vx9Fj3zWz1lQU9c8H75I3eyJZZ/ek2fNRBf7LYR6DaUEpvoHU38Ku',
                'role' => 'student',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Dr. Johnpaul Walker II',
                'username' => 'johnpaul.walker',
                'email' => 'johnpaul.walker@example.com',
                'email_verified_at' => now(),
                'password' => '$2y$12$7dWvYFDfLUtFjabq9bFG4.x52XURkIwsRJpcShla7SRSskD5Q/fQe',
                'role' => 'student',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Shanny Johnson',
                'username' => 'shanny.johnson',
                'email' => 'shanny.johnson@example.com',
                'email_verified_at' => now(),
                'password' => '$2y$12$RSW.ZayJQXRR6FkFGC.LeO6IdfLF8e8qYsPp2G.VaQhaaeO72kwZe',
                'role' => 'student',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Karine Bartoletti',
                'username' => 'karine.bartoletti',
                'email' => 'karine.bartoletti@example.com',
                'email_verified_at' => now(),
                'password' => '$2y$12$806ahTE6FkevaDnJFVrFU.dZksbC1DuD.eqLN4zhfAWhwRncsQs.i',
                'role' => 'student',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Blair Boyle',
                'username' => 'INUSR4355',
                'email' => null,
                'email_verified_at' => null,
                'password' => '$2y$12$7uV9C266au77.yC.Ro8HlecAtTNCrkjWC8XDp2JsNY3fBF2BPYwMS',
                'role' => 'student',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Adele Lind',
                'username' => 'INUSR1649',
                'email' => null,
                'email_verified_at' => null,
                'password' => '$2y$12$mUWnWVsqE5bKH.ILZeDgx.6vYYRi9XNVaI.rGm9LCpD4Fy1FEenqm',
                'role' => 'student',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Myrna Jakubowski',
                'username' => 'INUSR4785',
                'email' => null,
                'email_verified_at' => null,
                'password' => '$2y$12$6Xlq3UutYxXN1pcLe2jkZeK0h1JhLo2JD4bn0Gi.coUU8qv3VFHIi',
                'role' => 'student',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Prof. Heath Von',
                'username' => 'INUSR1115',
                'email' => null,
                'email_verified_at' => null,
                'password' => '$2y$12$ehgQvUWbtQBJPJACset/lO3Q2hv9LHS09mnD1pbeXVgmXDOV/uEpO',
                'role' => 'student',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Mr. Thomas Williamson',
                'username' => 'INUSR7263',
                'email' => null,
                'email_verified_at' => null,
                'password' => '$2y$12$IFs0bF8ERE5JqtN46L7d8OOoo4Cf8npq.k8Bp3agbEU9WgwCC8vSy',
                'role' => 'student',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Dr. Ashleigh Grant DVM',
                'username' => 'INUSR8934',
                'email' => null,
                'email_verified_at' => null,
                'password' => '$2y$12$r3IcWlsMFU9JejR1/66ZM.JqTzjwNS.crV58HQMCOdo9jzQOIpjve',
                'role' => 'student',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Mr. Price McClure',
                'username' => 'INUSR2041',
                'email' => null,
                'email_verified_at' => null,
                'password' => '$2y$12$mHGJl5E1u4eCl7SHIczMi.yjYVaC70q9nHTmg9ArAuRlg0S9nyOlS',
                'role' => 'student',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Rosemary Reynolds',
                'username' => 'INUSR3051',
                'email' => null,
                'email_verified_at' => null,
                'password' => '$2y$12$5i2HAT//rIS3YM6MW0nov.IufNzv0xY1LF.fx4yDVf5pf.vge2ghK',
                'role' => 'student',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Urban Marks',
                'username' => 'INUSR2757',
                'email' => null,
                'email_verified_at' => null,
                'password' => '$2y$12$V/GuohZ1QEdOQJSQvGaa.eEao6Bp7W6DZ8BBiqZYWM4Ws1uZhVdrm',
                'role' => 'student',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Prof. Ayden Stanton III',
                'username' => 'INUSR1746',
                'email' => null,
                'email_verified_at' => null,
                'password' => '$2y$12$JF3Xqq64wqp3W5VSWPxi0uePn7pZFN7qTXIom01WWEiyLnYwyr1f6',
                'role' => 'student',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Virgil Ortiz II',
                'username' => 'INUSR6402',
                'email' => null,
                'email_verified_at' => null,
                'password' => '$2y$12$jgdeNnVtb/dQXeEaR.3.euEtrr6QV58xzggOgO/CuKrOCiNpK9mYW',
                'role' => 'student',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Alisa Cormier DDS',
                'username' => 'INUSR5851',
                'email' => null,
                'email_verified_at' => null,
                'password' => '$2y$12$.MIB9JW46O70AaocvRn6qOdGfw8Jn48vVDgcYRq/xIXkezYerkbw6',
                'role' => 'student',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Prof. Landen Schuppe',
                'username' => 'INUSR6576',
                'email' => null,
                'email_verified_at' => null,
                'password' => '$2y$12$HgZTwfc47iL/GADq/G/Wruhgxj6GBdcoLpoUuJCMPInDr5QNQINVC',
                'role' => 'student',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Lizeth Lind',
                'username' => 'INUSR5724',
                'email' => null,
                'email_verified_at' => null,
                'password' => '$2y$12$Ujw8Vqht6EEC87ElD4n/PuRuwExsZnn2hILAbiCI07HYMgl9V43WS',
                'role' => 'student',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Dr. Crawford Stanton Jr.',
                'username' => 'INUSR3698',
                'email' => null,
                'email_verified_at' => null,
                'password' => '$2y$12$ZgiWHhqrnQV563zuDjJn9e7eM6oaD./EFHUKn0LVtmjrgF6TL5RBu',
                'role' => 'student',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Taurean Gerlach',
                'username' => null,
                'email' => 'taryn.bogisich@example.org',
                'email_verified_at' => null,
                'password' => '$2y$12$JrUcBM6Wfi9O6PAHA4cYfuvpB1cIzG66H45i41JninaI6sQtZSCEG',
                'role' => 'library',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Milo Mitchell',
                'username' => null,
                'email' => 'magnus01@example.org',
                'email_verified_at' => null,
                'password' => '$2y$12$gTbT4b1WpHM7btqvpZ655uJsi.MkVlUoun.oMS3kyWiF.ywsGMfmS',
                'role' => 'registrar',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Brayan Kulas',
                'username' => null,
                'email' => 'art81@example.com',
                'email_verified_at' => null,
                'password' => '$2y$12$upPBKz67nIapNInEVfJ7ke2Jap3Aq4F7agfdGG43ilZVqQxOx1WHi',
                'role' => 'library',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Prof. Archibald Ziemann MD',
                'username' => null,
                'email' => 'scot.lakin@example.org',
                'email_verified_at' => null,
                'password' => '$2y$12$jEjPCkfxktB2Fe9OBdijteajBnaLQvYoXXy/BMbRGtpuQv1RTHjDW',
                'role' => 'proctor',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Leatha McKenzie',
                'username' => null,
                'email' => 'lyla47@example.net',
                'email_verified_at' => null,
                'password' => '$2y$12$fWnFAR9B8sCfpy8EPHozLepjxCkJ45tW6Dvf2rFWzMFwgzjpfCO2y',
                'role' => 'proctor',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Hilma Marks',
                'username' => null,
                'email' => 'kmiller@example.com',
                'email_verified_at' => null,
                'password' => '$2y$12$tPQRqaX5opDU/EIu4I/08evENx0braYmFyS4nyrFMrRcbYQo5dv4m',
                'role' => 'library',
                'profile_image' => $imageUrl,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [

                'name' => 'Abraham Sewenat',
                'username' => null,
                'email' => 'dave@gmail.com',
                'email_verified_at' => null,
                'password' => '$2y$12$rUHu/Zkm79mEyOQ/WGIgfOZv8xEWVVLoIDUOQ3fGBU7VAeDXyVeL2',
                'role' => 'department_head',
                'profile_image' => null,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        foreach ($users as $userData) {
            User::create($userData);
        }

        $students = [
            [
                'user_id' => 25,
                'student_id' => 'INUSR/9580/17',
                'department_id' => 6,
                'year' => '1st Year',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'user_id' => 26,
                'student_id' => 'INUSR/8654/10',
                'department_id' => 30,
                'year' => '3rd Year',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 4,
                'user_id' => 27,
                'student_id' => 'INUSR/4554/11',
                'department_id' => 33,
                'year' => '4th Year',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 5,
                'user_id' => 28,
                'student_id' => 'INUSR/3031/23',
                'department_id' => 10,
                'year' => '4th Year',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 6,
                'user_id' => 29,
                'student_id' => 'INUSR/6922/17',
                'department_id' => 42,
                'year' => '2nd Year',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 7,
                'user_id' => 30,
                'student_id' => 'INUSR/1503/24',
                'department_id' => 39,
                'year' => '2nd Year',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 8,
                'user_id' => 31,
                'student_id' => 'INUSR/3638/17',
                'department_id' => 34,
                'year' => '3rd Year',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 9,
                'user_id' => 32,
                'student_id' => 'INUSR/6336/15',
                'department_id' => 38,
                'year' => '2nd Year',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 10,
                'user_id' => 33,
                'student_id' => 'INUSR/7362/18',
                'department_id' => 24,
                'year' => '3rd Year',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 11,
                'user_id' => 34,
                'student_id' => 'INUSR/7633/23',
                'department_id' => 44,
                'year' => '2nd Year',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 12,
                'user_id' => 35,
                'student_id' => 'INUSR/4678/23',
                'department_id' => 31,
                'year' => '3rd Year',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 13,
                'user_id' => 36,
                'student_id' => 'INUSR/1765/17',
                'department_id' => 25,
                'year' => '1st Year',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 14,
                'user_id' => 37,
                'student_id' => 'INUSR/8695/23',
                'department_id' => 25,
                'year' => '2nd Year',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 15,
                'user_id' => 38,
                'student_id' => 'INUSR/6273/10',
                'department_id' => 22,
                'year' => '3rd Year',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 16,
                'user_id' => 39,
                'student_id' => 'INUSR/1148/10',
                'department_id' => 41,
                'year' => '3rd Year',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        foreach ($students as $studentsData) {
            DB::table('students')->insert($studentsData);
        }

        $clearance_requests = [
            [
                'student_id' => 'INUSR/3031/23',
                'sex' => 'Male',
                'status' => 'pending',
                'year' => '4th Year',
                'semester' => 'First',
                'section' => 'B',
                'department_id' => 10,
                'academic_year' => '1998-1999',
                'last_day_class_attended' => '2016-06-01',
                'reason_for_clearance' => 'Voluptas aut architecto voluptatem quia.',
                'cafe_status' => 'non-cafe',
                'dorm_status' => 'non-dorm',
                'current_step' => 'department_head',
                'archived' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'student_id' => 'INUSR/3031/23',
                'sex' => 'Male',
                'status' => 'pending',
                'approvals' => null,
                'year' => '4th Year',
                'semester' => 'First',
                'section' => 'B',
                'department_id' => 10,
                'academic_year' => '1998-1999',
                'last_day_class_attended' => '2016-06-01',
                'reason_for_clearance' => 'Voluptas aut architecto voluptatem quia.',
                'cafe_status' => 'non-cafe',
                'dorm_status' => 'non-dorm',
                'current_step' => 'department_head',
                'department_head_approved' => null,
                'library_approved' => null,
                'cafeteria_approved' => null,
                'proctor_approved' => null,
                'registrar_approved' => null,
                'archived' => false,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'student_id' => 'INUSR/8654/10',
                'sex' => 'Female',
                'status' => 'pending',
                'approvals' => null,
                'year' => '3rd Year',
                'semester' => 'Second',
                'section' => 'C',
                'department_id' => 30,
                'academic_year' => '1980-2016',
                'last_day_class_attended' => '1981-07-09',
                'reason_for_clearance' => 'Amet quo id temporibus rerum et distinctio velit.',
                'cafe_status' => 'cafe',
                'dorm_status' => 'non-dorm',
                'current_step' => 'department_head',
                'department_head_approved' => null,
                'library_approved' => null,
                'cafeteria_approved' => null,
                'proctor_approved' => null,
                'registrar_approved' => null,
                'archived' => false,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'student_id' => 'INUSR/1503/24',
                'sex' => 'Female',
                'status' => 'pending',
                'approvals' => null,
                'year' => '2nd Year',
                'semester' => 'First',
                'section' => 'A',
                'department_id' => 39,
                'academic_year' => '2021-2007',
                'last_day_class_attended' => '1978-05-15',
                'reason_for_clearance' => 'Tenetur dolorem quisquam nostrum.',
                'cafe_status' => 'non-cafe',
                'dorm_status' => 'non-dorm',
                'current_step' => 'department_head',
                'department_head_approved' => null,
                'library_approved' => null,
                'cafeteria_approved' => null,
                'proctor_approved' => null,
                'registrar_approved' => null,
                'archived' => false,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'student_id' => 'INUSR/7633/23',
                'sex' => 'Female',
                'status' => 'pending',
                'approvals' => null,
                'year' => '2nd Year',
                'semester' => 'First',
                'section' => 'A',
                'department_id' => 44,
                'academic_year' => '2015-2015',
                'last_day_class_attended' => '1991-02-12',
                'reason_for_clearance' => 'Placeat consequatur unde deleniti rerum excepturi tenetur aut.',
                'cafe_status' => 'non-cafe',
                'dorm_status' => 'non-dorm',
                'current_step' => 'department_head',
                'department_head_approved' => null,
                'library_approved' => null,
                'cafeteria_approved' => null,
                'proctor_approved' => null,
                'registrar_approved' => null,
                'archived' => false,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'student_id' => 'INUSR/4554/11',
                'sex' => 'Female',
                'status' => 'pending',
                'approvals' => null,
                'year' => '4th Year',
                'semester' => 'First',
                'section' => 'C',
                'department_id' => 33,
                'academic_year' => '1975-2007',
                'last_day_class_attended' => '2025-01-09',
                'reason_for_clearance' => 'Autem et id minima quo est quaerat minus.',
                'cafe_status' => 'cafe',
                'dorm_status' => 'dorm',
                'current_step' => 'department_head',
                'department_head_approved' => null,
                'library_approved' => null,
                'cafeteria_approved' => null,
                'proctor_approved' => null,
                'registrar_approved' => null,
                'archived' => false,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'student_id' => 'INUSR/6273/10',
                'sex' => 'Female',
                'status' => 'pending',
                'approvals' => null,
                'year' => '3rd Year',
                'semester' => 'Second',
                'section' => 'C',
                'department_id' => 22,
                'academic_year' => '2013-2017',
                'last_day_class_attended' => '2003-04-01',
                'reason_for_clearance' => 'Deserunt tempore nihil omnis necessitatibus enim expedita.',
                'cafe_status' => 'non-cafe',
                'dorm_status' => 'dorm',
                'current_step' => 'department_head',
                'department_head_approved' => null,
                'library_approved' => null,
                'cafeteria_approved' => null,
                'proctor_approved' => null,
                'registrar_approved' => null,
                'archived' => false,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'student_id' => 'INUSR/4678/23',
                'sex' => 'Male',
                'status' => 'pending',
                'approvals' => null,
                'year' => '3rd Year',
                'semester' => 'Second',
                'section' => 'A',
                'department_id' => 31,
                'academic_year' => '1976-2017',
                'last_day_class_attended' => '2017-07-21',
                'reason_for_clearance' => 'Qui quia molestiae dolor expedita.',
                'cafe_status' => 'non-cafe',
                'dorm_status' => 'non-dorm',
                'current_step' => 'department_head',
                'department_head_approved' => null,
                'library_approved' => null,
                'cafeteria_approved' => null,
                'proctor_approved' => null,
                'registrar_approved' => null,
                'archived' => false,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'student_id' => 'INUSR/3638/17',
                'sex' => 'Female',
                'status' => 'pending',
                'approvals' => null,
                'year' => '3rd Year',
                'semester' => 'First',
                'section' => 'C',
                'department_id' => 34,
                'academic_year' => '2010-1986',
                'last_day_class_attended' => '2024-06-27',
                'reason_for_clearance' => 'Reiciendis quia eligendi atque hic natus enim consectetur.',
                'cafe_status' => 'cafe',
                'dorm_status' => 'dorm',
                'current_step' => 'department_head',
                'department_head_approved' => null,
                'library_approved' => null,
                'cafeteria_approved' => null,
                'proctor_approved' => null,
                'registrar_approved' => null,
                'archived' => false,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'student_id' => 'INUSR/7633/23',
                'sex' => 'Female',
                'status' => 'pending',
                'approvals' => null,
                'year' => '2nd Year',
                'semester' => 'Second',
                'section' => 'A',
                'department_id' => 44,
                'academic_year' => '2011-1991',
                'last_day_class_attended' => '2021-10-25',
                'reason_for_clearance' => 'Quis velit nemo consectetur hic nam sunt quidem.',
                'cafe_status' => 'non-cafe',
                'dorm_status' => 'non-dorm',
                'current_step' => 'department_head',
                'department_head_approved' => null,
                'library_approved' => null,
                'cafeteria_approved' => null,
                'proctor_approved' => null,
                'registrar_approved' => null,
                'archived' => false,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'student_id' => 'INUSR/3031/23',
                'sex' => 'Male',
                'status' => 'pending',
                'approvals' => null,
                'year' => '4th Year',
                'semester' => 'First',
                'section' => 'B',
                'department_id' => 10,
                'academic_year' => '2005-2015',
                'last_day_class_attended' => '1972-05-05',
                'reason_for_clearance' => 'Quis consectetur harum molestiae quos.',
                'cafe_status' => 'cafe',
                'dorm_status' => 'non-dorm',
                'current_step' => 'department_head',
                'department_head_approved' => null,
                'library_approved' => null,
                'cafeteria_approved' => null,
                'proctor_approved' => null,
                'registrar_approved' => null,
                'archived' => false,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'student_id' => 'INUSR/7362/18',
                'sex' => 'Male',
                'status' => 'pending',
                'approvals' => null,
                'year' => '3rd Year',
                'semester' => 'First',
                'section' => 'C',
                'department_id' => 24,
                'academic_year' => '1996-1972',
                'last_day_class_attended' => '2024-02-25',
                'reason_for_clearance' => 'Excepturi mollitia nesciunt quo assumenda consequatur.',
                'cafe_status' => 'non-cafe',
                'dorm_status' => 'dorm',
                'current_step' => 'department_head',
                'department_head_approved' => null,
                'library_approved' => null,
                'cafeteria_approved' => null,
                'proctor_approved' => null,
                'registrar_approved' => null,
                'archived' => false,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'student_id' => 'INUSR/7633/23',
                'sex' => 'Male',
                'status' => 'pending',
                'approvals' => null,
                'year' => '2nd Year',
                'semester' => 'First',
                'section' => 'B',
                'department_id' => 44,
                'academic_year' => '1989-2026',
                'last_day_class_attended' => '2007-12-23',
                'reason_for_clearance' => 'Nisi qui hic vitae ipsam minima nisi quia voluptatem.',
                'cafe_status' => 'cafe',
                'dorm_status' => 'dorm',
                'current_step' => 'department_head',
                'department_head_approved' => null,
                'library_approved' => null,
                'cafeteria_approved' => null,
                'proctor_approved' => null,
                'registrar_approved' => null,
                'archived' => false,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'student_id' => 'INUSR/1503/24',
                'sex' => 'Female',
                'status' => 'pending',
                'approvals' => null,
                'year' => '2nd Year',
                'semester' => 'First',
                'section' => 'C',
                'department_id' => 39,
                'academic_year' => '1982-1988',
                'last_day_class_attended' => '1973-07-09',
                'reason_for_clearance' => 'Occaecati accusantium in placeat et atque debitis.',
                'cafe_status' => 'cafe',
                'dorm_status' => 'non-dorm',
                'current_step' => 'department_head',
                'department_head_approved' => null,
                'library_approved' => null,
                'cafeteria_approved' => null,
                'proctor_approved' => null,
                'registrar_approved' => null,
                'archived' => false,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'student_id' => 'INUSR/8654/10',
                'sex' => 'Female',
                'status' => 'pending',
                'approvals' => null,
                'year' => '3rd Year',
                'semester' => 'First',
                'section' => 'C',
                'department_id' => 30,
                'academic_year' => '1996-2011',
                'last_day_class_attended' => '2019-10-08',
                'reason_for_clearance' => 'Autem aut quaerat accusantium sed quibusdam alias tempora.',
                'cafe_status' => 'non-cafe',
                'dorm_status' => 'dorm',
                'current_step' => 'department_head',
                'department_head_approved' => null,
                'library_approved' => null,
                'cafeteria_approved' => null,
                'proctor_approved' => null,
                'registrar_approved' => null,
                'archived' => false,
                'created_at' => now(),
                'updated_at' => now()
            ],
        ];

        foreach ($clearance_requests as $clearance_requestsData) {
            DB::table('clearance_requests')->insert($clearance_requestsData);
        }
    }
}
