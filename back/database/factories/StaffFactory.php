<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Staff>
 */
class StaffFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Staff::class;
    public function definition(): array
    {
        // return [
        //     'user_id' => User::factory()->state(['role' => 'staff']),
        //     'role' => $this->faker->randomElement(['department_head', 'library', 'cafeteria', 'proctor', 'registrar']),
        //     'position' => $this->faker->randomElement(['department_head', 'library', 'cafeteria', 'proctor', 'registrar']),
        //     'department_id' => Department::inRandomOrder()->first()->id ?? 1, // Select existing department or default to 1
        // ];
        $department = Department::inRandomOrder()->first() ?? Department::factory()->create();
        $role = $this->faker->randomElement(['library', 'cafeteria', 'proctor', 'registrar']);

        if (!Staff::where('department_id', $department->id)->where('role', 'department_head')->exists()) {
            $role = 'department_head';
        }

        return [
            'user_id' => User::factory(),
            'position' => $role,
            'role' => $role,
            'department_id' => $department->id,
        ];
    }
}
