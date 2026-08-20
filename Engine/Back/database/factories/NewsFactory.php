<?php

namespace Database\Factories;

use App\Models\News;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<News>
 */
class NewsFactory extends Factory
{
    protected $model = News::class;

    public function definition(): array
    {
        return [
            'titulo' => $this->faker->sentence(6),
            'tipo' => $this->faker->randomElement(['Evento', 'Notícia', 'Publicação', 'Atualização']),
            'subtitulo' => $this->faker->sentence(10),
            'data' => $this->faker->date(),
            'corpo' => $this->faker->paragraphs(3, true),
        ];
    }
}
