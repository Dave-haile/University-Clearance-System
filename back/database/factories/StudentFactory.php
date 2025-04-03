<?php

namespace Database\Factories;

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
        $randId = rand(0000, 10000);
        $randYear = rand(10, 17);
        $studentId = 'INUSR/' . $randId . '/' . $randYear;
        return [
            'user_id' => User::factory()->state(['role' => 'student']), // Create user with student role
            'student_id' => $studentId,
            'department' => $this->faker->unique()->randomElement([
                'Computer Science',
                'Software Engineering',
                'Information Systems',
                'Electrical Engineering',
                'Mechanical Engineering',
                'Civil Engineering',
                'Biomedical Engineering',
                'Physics',
                'Mathematics',
                'Data Science'
            ]),
            'year' => $this->faker->randomElement([
                '1st year',
                '2nd year',
                '3rd year',
                '4th year',
                '5th year',
                '6th year',
            ])
        ];
    }
}
