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
        $role = $this->faker->randomElement(['library', 'cafeteria', 'proctor', 'registrar']);

        return [
            'user_id' => User::factory()->staff(),
            'position' => $role,
            'role' => $role,
            'department_id' => null,
        ];
    }
}
