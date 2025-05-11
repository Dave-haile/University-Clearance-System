<?php

namespace Database\Factories;

use App\HasRandomImages;
use Exception;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    // public function definition(): array
    // {
    //     $role = $this->faker->randomElement([
    //         'student', 'department_head', 'library', 'cafeteria', 'proctor', 'registrar',
    //     ]);
    //     return [
    //         'name' => $this->faker->name(),
    //         'username' => $role === 'student' ? $this->faker->unique()->userName() : null,
    //         'email' => $role !== 'student' ? $this->faker->unique()->safeEmail() : null,
    //         'password' => bcrypt('password'), // Default password
    //         'role' => $role,
    //         'profile_image' => null,
    //         'remember_token' => Str::random(10),
    //     ];
    // }
    use HasRandomImages;
    public function definition(): array
    {
        $imageDirectory = public_path('profiles');

        $images = File::files($imageDirectory);
        if (count($images) === 0) {
            $imageUrl = null; 
        } else {
            $randomImage = collect($images)->random();
            $imageUrl = url('profiles/' . $randomImage->getFilename());
        }

        return [
            'name' => $this->faker->name(),
            'username' => null,
            'email' => null,
            'password' => bcrypt('password'),
            'role' => 'student', 
            'profile_image' => $imageUrl,
        ];
    }

    public function student()
    {
        return $this->state(fn() => [
            'username' => 'INUSR' . rand(1000, 9999),
            'email' => null,
            'role' => 'student',
        ]);
    }

    public function staff()
    {
        return $this->state(fn() => [
            'email' => $this->faker->unique()->safeEmail(),
            'username' => null,
            'role' => $this->faker->randomElement([
                'department_head',
                'library',
                'cafeteria',
                'proctor',
                'registrar',
            ]),
        ]);
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
