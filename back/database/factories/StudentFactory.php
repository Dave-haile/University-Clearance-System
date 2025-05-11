<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
{
    $randId = rand(1000, 9999);
    $randYear = rand(10, 25);
    $studentId = 'INUSR/' . $randId . '/' . $randYear;

    return [
        'user_id' => User::factory()->student(),
        'student_id' => $studentId,
        'department_id' => Department::inRandomOrder()->first()?->id ?? Department::factory(),
        'year' => $this->faker->randomElement([
            '1st Year', '2nd Year', '3rd Year', '4th Year'
        ]),
    ];
}
}
