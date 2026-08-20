<?php

namespace Database\Factories;

use App\Models\Publication;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Publication>
 */
class PublicationFactory extends Factory
{
    protected $model = Publication::class;

    public function definition(): array
    {
        return [
            'titulo' => $this->faker->sentence(6),
            'tipo' => $this->faker->randomElement(['Journal', 'Conference', 'Book Chapter', 'Workshop']),
            'autores' => implode(', ', $this->faker->randomElements([
                'Silva, A.',
                'Costa, R.',
                'Souza, M.',
                'Pereira, L.',
                'Almeida, F.',
            ], 3)),
            'onde_publicado' => $this->faker->company(),
            'ano' => $this->faker->numberBetween(2018, 2026),
            'doi' => '10.' . $this->faker->numberBetween(1000, 9999) . '/' . $this->faker->lexify('????'),
        ];
    }
}
