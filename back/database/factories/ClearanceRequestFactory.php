<?php

namespace Database\Factories;

use App\Models\ClearanceRequest;
use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ClearanceRequest>
 */
class ClearanceRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = ClearanceRequest::class;
    // public function definition(): array
    // {
    //     $approvals = [
    //         'department_head' => $this->faker->boolean(70),  // 70% chance approved
    //         'library' => $this->faker->boolean(50),
    //         'cafeteria' => $this->faker->boolean(50),
    //         'proctor' => $this->faker->boolean(50),
    //         'registrar' => $this->faker->boolean(50),
    //     ];

    //     return [
    //         'student_id' => Student::inRandomOrder()->first()->student_id ?? 'INUSR/0012/19',
    //         'sex' => $this->faker->randomElement(['Male', 'Female']),
    //         'status' => $this->faker->randomElement(['pending', 'approved', 'rejected']),
    //         'approvals' => json_encode($approvals),
    //         'year' => $this->faker->numberBetween(1, 5),
    //         'semester' => $this->faker->randomElement(['First', 'Second']),
    //         'section' => $this->faker->randomElement(['A', 'B', 'C']),
    //         'department' => $this->faker->randomElement(['Computer Science', 'Software Engineering', 'Information Systems']),
    //         'college' => 'College of Computing', // Static value, adjust as needed
    //         'academic_year' => $this->faker->year() . '-' . ($this->faker->year() + 1),
    //         'last_day_class_attended' => $this->faker->date(),
    //         'reason_for_clearance' => $this->faker->sentence(),
    //         'cafe_status' => $this->faker->randomElement(['cafe', 'non-cafe']),
    //         'dorm_status' => $this->faker->randomElement(['dorm', 'non-dorm']),
    //         'current_step' => $this->faker->randomElement(['department_head', 'library', 'cafeteria', 'proctor', 'registrar']),
    //         'department_head_approved' => $approvals['department_head'],
    //         'library_approved' => $approvals['library'],
    //         'cafeteria_approved' => $approvals['cafeteria'],
    //         'proctor_approved' => $approvals['proctor'],
    //         'registrar_approved' => $approvals['registrar'],
    //     ];
    // }
    // public function definition(): array
    // {
    //     $student = Student::inRandomOrder()->first() ?? Student::factory()->create();
    //     $department = Department::find($student->department_id);

    //     $approvals = [
    //         'department_head' => $this->faker->optional()->boolean(70),
    //         'library' => $this->faker->optional()->boolean(50),
    //         'cafeteria' => $this->faker->optional()->boolean(50),
    //         'proctor' => $this->faker->optional()->boolean(50),
    //         'registrar' => $this->faker->optional()->boolean(50),
    //     ];

    //     // Compute status
    //     $approvalValues = array_values($approvals);
    //     $status = 'pending';
    //     if (in_array(false, $approvalValues, true)) {
    //         $status = 'rejected';
    //     } elseif (!in_array(null, $approvalValues, true) && array_reduce($approvalValues, fn($carry, $val) => $carry && $val, true)) {
    //         $status = 'approved';
    //     }

    //     return [
    //         'student_id' => $student->student_id,
    //         'sex' => $this->faker->randomElement(['Male', 'Female']),
    //         'status' => $status,
    //         'approvals' => json_encode($approvals),
    //         'year' => $student->year,
    //         'semester' => $this->faker->randomElement(['First', 'Second']),
    //         'section' => $this->faker->randomElement(['A', 'B', 'C']),
    //         'department' => $department?->department ?? 'Unknown',
    //         'college' => $department?->college ?? 'Unknown',
    //         'academic_year' => $this->faker->year() . '-' . ($this->faker->year() + 1),
    //         'last_day_class_attended' => $this->faker->date(),
    //         'reason_for_clearance' => $this->faker->sentence(),
    //         'cafe_status' => $this->faker->randomElement(['cafe', 'non-cafe']),
    //         'dorm_status' => $this->faker->randomElement(['dorm', 'non-dorm']),
    //         'current_step' => $this->faker->randomElement([
    //             'department_head',
    //             'library',
    //             'cafeteria',
    //             'proctor',
    //             'registrar'
    //         ]),
    //         'department_head_approved' => $approvals['department_head'],
    //         'library_approved' => $approvals['library'],
    //         'cafeteria_approved' => $approvals['cafeteria'],
    //         'proctor_approved' => $approvals['proctor'],
    //         'registrar_approved' => $approvals['registrar'],
    //     ];
    // }
    public function definition(): array
    {
        $student = Student::inRandomOrder()->first();

        $approvals = [
            'department_head' => null,
            'library' => null,
            'cafeteria' => null,
            'proctor' => null,
            'registrar' => null,
        ];

        $outcome = $this->faker->randomElement([
            'pending',
            'pending',
            'pending',
            'pending',
            'pending',
            'pending',
            'pending',
            'approved',
            'approved',
            'rejected',
        ]);

        switch ($outcome) {
            case 'approved':
                foreach ($approvals as $step => $_) {
                    $approvals[$step] = true;
                }
                break;

            case 'rejected':
                foreach ($approvals as $step => $_) {
                    $approvals[$step] = true;
                    if ($this->faker->boolean(30)) {
                        $approvals[$step] = false;
                        break;
                    }
                }
                break;

            case 'pending':
                $steps = array_keys($approvals);
                $completedSteps = $this->faker->numberBetween(0, 3);
                for ($i = 0; $i < $completedSteps; $i++) {
                    $approvals[$steps[$i]] = true;
                }
                break;
        }

        $status = in_array(false, $approvals)
            ? 'rejected'
            : (in_array(null, $approvals) ? 'pending' : 'approved');


        return [
            'student_id' => $student->student_id,
            'sex' => $this->faker->randomElement(['Male', 'Female']),
            'status' => $status,
            'approvals' => json_encode($approvals),
            'year' => $student->year,
            'semester' => $this->faker->randomElement(['First', 'Second']),
            'section' => $this->faker->randomElement(['A', 'B', 'C']),
            'department' => $student->department->department,
            'college' => $student->department->college,
            'academic_year' => $this->faker->year() . '-' . ($this->faker->year() + 1),
            'last_day_class_attended' => $this->faker->date(),
            'reason_for_clearance' => $this->faker->sentence(),
            'cafe_status' => $this->faker->randomElement(['cafe', 'non-cafe']),
            'dorm_status' => $this->faker->randomElement(['dorm', 'non-dorm']),
            'current_step' => collect($approvals)->search(null) ?: 'all_approved',
            'department_head_approved' => $approvals['department_head'],
            'library_approved' => $approvals['library'],
            'cafeteria_approved' => $approvals['cafeteria'],
            'proctor_approved' => $approvals['proctor'],
            'registrar_approved' => $approvals['registrar'],
        ];
    }
}
