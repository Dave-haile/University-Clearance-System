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
    public function definition(): array
    {
        $approvals = [
            'department_head' => $this->faker->boolean(70),  // 70% chance approved
            'library' => $this->faker->boolean(50),
            'cafeteria' => $this->faker->boolean(50),
            'proctor' => $this->faker->boolean(50),
            'registrar' => $this->faker->boolean(50),
        ];

        return [
            'student_id' => Student::inRandomOrder()->first()->student_id ?? 'STU0001',
            'sex' => $this->faker->randomElement(['Male', 'Female']),
            'status' => $this->faker->randomElement(['pending', 'approved', 'rejected']),
            'approvals' => json_encode($approvals),
            'year' => $this->faker->numberBetween(1, 5),
            'semester' => $this->faker->randomElement(['First', 'Second']),
            'section' => $this->faker->randomElement(['A', 'B', 'C']),
            'department' => $this->faker->randomElement(['Computer Science', 'Software Engineering', 'Information Systems']),
            'college' => 'College of Computing', // Static value, adjust as needed
            'academic_year' => $this->faker->year() . '-' . ($this->faker->year() + 1),
            'last_day_class_attended' => $this->faker->date(),
            'reason_for_clearance' => $this->faker->sentence(),
            'cafe_status' => $this->faker->randomElement(['cafe', 'non-cafe']),
            'dorm_status' => $this->faker->randomElement(['dorm', 'non-dorm']),
            'current_step' => $this->faker->randomElement(['department_head', 'library', 'cafeteria', 'proctor', 'registrar']),
            'department_head_approved' => $approvals['department_head'],
            'library_approved' => $approvals['library'],
            'cafeteria_approved' => $approvals['cafeteria'],
            'proctor_approved' => $approvals['proctor'],
            'registrar_approved' => $approvals['registrar'],
        ];
    }
}
