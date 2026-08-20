<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        $startYear = $this->faker->numberBetween(2018, 2023);
        $endYear = $this->faker->numberBetween($startYear, 2026);

        return [
            'titulo' => $this->faker->sentence(4),
            'areas' => [$this->faker->word(), $this->faker->word()],
            'subtitulo' => $this->faker->sentence(8),
            'descricao' => $this->faker->paragraph(3),
            'objetivos' => $this->faker->paragraph(2),
            'tecnologias' => implode(', ', $this->faker->randomElements(['PHP', 'Laravel', 'MySQL', 'Vue', 'React', 'Docker'], 3)),
            'ano_inicio' => $startYear,
            'ano_fim' => $endYear,
            'financiamento' => $this->faker->randomElement(['FAPESP', 'CNPq', 'CAPES', 'Empresa privada', 'Próprio']),
        ];
    }
}
