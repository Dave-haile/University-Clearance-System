<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\ClearanceRequest;
use App\Models\Department;
use App\Models\Staff;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class DatabaseSeeder extends Seeder
{
    // 
    public function run(): void
    {
        $imageUrl = $this->getRandomProfileImageUrl();

        if (Department::query()->count() === 0) {
            $this->call([DepartmentsTableSeeder::class]);
        }
        if (Staff::query()->count() === 0) {
            $this->call([StaffTableSeeder::class]);
        }

        $departments = Department::query()
            ->whereIn("department", [
                "Computer Science",
                "Software Engineering",
                "Information Systems",
                "Civil Engineering",
                "Nursing",
            ])
            ->pluck("id", "department");

        $adminUser = User::query()->updateOrCreate(
            ["email" => "admin@university.com"],
            [
                "name" => "Dawit Haile",
                "password" => bcrypt("password"),
                "role" => "admin",
                "profile_image" => $imageUrl,
            ],
        );

        Admin::query()->updateOrCreate(
            ["user_id" => $adminUser->id],
            ["admin_code" => "ADMIN001"],
        );

        $studentsData = [
            ["name" => "John Doe", "username" => "INUSR022113", "student_id" => "INUSR/0221/13", "department" => "Computer Science", "year" => "3rd Year"],
            ["name" => "Sarah Johnson", "username" => "INUSR022114", "student_id" => "INUSR/0221/14", "department" => "Software Engineering", "year" => "4th Year"],
            ["name" => "Michael Brown", "username" => "INUSR022115", "student_id" => "INUSR/0221/15", "department" => "Computer Science", "year" => "2nd Year"],
            ["name" => "Emily Davis", "username" => "INUSR022116", "student_id" => "INUSR/0221/16", "department" => "Information Systems", "year" => "3rd Year"],
            ["name" => "David Wilson", "username" => "INUSR022117", "student_id" => "INUSR/0221/17", "department" => "Civil Engineering", "year" => "4th Year"],
            ["name" => "Jessica Martinez", "username" => "INUSR022118", "student_id" => "INUSR/0221/18", "department" => "Nursing", "year" => "3rd Year"],
            ["name" => "James Anderson", "username" => "INUSR022119", "student_id" => "INUSR/0221/19", "department" => "Software Engineering", "year" => "2nd Year"],
            ["name" => "Olivia Taylor", "username" => "INUSR022120", "student_id" => "INUSR/0221/20", "department" => "Computer Science", "year" => "1st Year"],
            ["name" => "Daniel Thomas", "username" => "INUSR022121", "student_id" => "INUSR/0221/21", "department" => "Information Systems", "year" => "4th Year"],
            ["name" => "Sophia Jackson", "username" => "INUSR022122", "student_id" => "INUSR/0221/22", "department" => "Civil Engineering", "year" => "3rd Year"],
        ];

        $seededStudents = collect();
        foreach ($studentsData as $data) {
            $departmentId = $departments[$data["department"]] ?? null;
            if (!$departmentId) {
                continue;
            }

            $user = User::query()->firstOrCreate(
                ["username" => $data["username"]],
                [
                    "name" => $data["name"],
                    "password" => bcrypt("password"),
                    "role" => "student",
                    "profile_image" => $imageUrl,
                ],
            );

            $seededStudents->push(
                Student::query()->firstOrCreate(
                    ["student_id" => $data["student_id"]],
                    [
                        "user_id" => $user->id,
                        "department_id" => $departmentId,
                        "year" => $data["year"],
                    ],
                ),
            );
        }

        $targetStudentCount = 30;
        $missingStudents = max(0, $targetStudentCount - Student::query()->count());
        $factoryStudents = $missingStudents > 0
            ? Student::factory($missingStudents)->create()
            : collect();
        $allStudents = $seededStudents->concat($factoryStudents)->values();

        $templateStatuses = [
            [
                "status" => "approved",
                "current_step" => "all_approved",
                "department_head_approved" => true,
                "library_approved" => true,
                "cafeteria_approved" => true,
                "proctor_approved" => true,
                "registrar_approved" => true,
                "approvals" => [
                    "department_head" => ["status" => "approved", "remarks" => null],
                    "library" => ["status" => "approved", "remarks" => null],
                    "cafeteria" => ["status" => "approved", "remarks" => null],
                    "proctor" => ["status" => "approved", "remarks" => null],
                    "registrar" => ["status" => "approved", "remarks" => null],
                ],
            ],
            [
                "status" => "rejected",
                "current_step" => "library",
                "department_head_approved" => true,
                "library_approved" => false,
                "cafeteria_approved" => null,
                "proctor_approved" => null,
                "registrar_approved" => null,
                "approvals" => [
                    "department_head" => ["status" => "approved", "remarks" => null],
                    "library" => ["status" => "rejected", "remarks" => "Outstanding item"],
                ],
            ],
            [
                "status" => "pending",
                "current_step" => "department_head",
                "department_head_approved" => null,
                "library_approved" => null,
                "cafeteria_approved" => null,
                "proctor_approved" => null,
                "registrar_approved" => null,
                "approvals" => [],
            ],
            [
                "status" => "pending",
                "current_step" => "library",
                "department_head_approved" => true,
                "library_approved" => null,
                "cafeteria_approved" => null,
                "proctor_approved" => null,
                "registrar_approved" => null,
                "approvals" => [
                    "department_head" => ["status" => "approved", "remarks" => "Eligible"],
                ],
            ],
        ];

        foreach ($allStudents->shuffle()->take(18) as $index => $student) {
            $template = $templateStatuses[$index % count($templateStatuses)];

            ClearanceRequest::query()->create([
                "student_id" => $student->student_id,
                "sex" => fake()->randomElement(["Male", "Female"]),
                "status" => $template["status"],
                "approvals" => $template["approvals"],
                "year" => $student->year,
                "semester" => fake()->randomElement(["First", "Second"]),
                "section" => fake()->randomElement(["A", "B", "C"]),
                "department_id" => $student->department_id,
                "academic_year" => "2025-2026",
                "last_day_class_attended" => now()->subDays(fake()->numberBetween(5, 60))->format("Y-m-d"),
                "reason_for_clearance" => fake()->randomElement([
                    "graduation",
                    "transfer",
                    "semester completion",
                    "withdrawal",
                ]),
                "cafe_status" => fake()->randomElement(["cafe", "non-cafe"]),
                "dorm_status" => fake()->randomElement(["dorm", "non-dorm"]),
                "current_step" => $template["current_step"],
                "department_head_approved" => $template["department_head_approved"],
                "library_approved" => $template["library_approved"],
                "cafeteria_approved" => $template["cafeteria_approved"],
                "proctor_approved" => $template["proctor_approved"],
                "registrar_approved" => $template["registrar_approved"],
                "archived" => fake()->boolean(20),
            ]);
        }

        $targetRequestCount = 30;
        $missingRequests = max(
            0,
            $targetRequestCount - ClearanceRequest::query()->count(),
        );
        if ($missingRequests > 0) {
            ClearanceRequest::factory($missingRequests)->create();
        }

        if (User::query()->count() < 60) {
            User::factory(5)->create();
        }
        if (Staff::query()->count() < 20) {
            Staff::factory(6)->create();
        }
    }

    private function getRandomProfileImageUrl(): ?string
    {
        $imageDirectory = public_path("profiles");
        if (!File::exists($imageDirectory)) {
            return null;
        }

        $images = File::files($imageDirectory);
        if (count($images) === 0) {
            return null;
        }

        return url("profiles/" . collect($images)->random()->getFilename());
    }
}
