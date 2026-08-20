<?php

namespace Database\Factories;

use App\Models\Member;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Member>
 */
class MemberFactory extends Factory
{
    protected $model = Member::class;

    public function definition(): array
    {
        return [
            'nome' => $this->faker->name(),
            'areas' => [$this->faker->word(), $this->faker->word()],
            'email' => $this->faker->unique()->safeEmail(),
            'biografia' => $this->faker->paragraph(),
            'funcao' => $this->faker->jobTitle(),
            'formacao' => $this->faker->randomElement(['Engenharia', 'Ciência da Computação', 'Física', 'Matemática']),
            'linkedin' => $this->faker->userName(),
            'lattes' => (string) $this->faker->numberBetween(1000000000, 9999999999),
            'url_foto' => $this->faker->imageUrl(640, 480, 'people'),
        ];
    }
}
