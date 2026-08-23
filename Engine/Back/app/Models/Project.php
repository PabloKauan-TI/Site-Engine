<?php

namespace App\Models;

use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'Project',
    type: 'object',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'titulo', type: 'string', example: 'Projeto X'),
        new OA\Property(property: 'areas', type: 'array', items: new OA\Items(type: 'string')),
        new OA\Property(property: 'subtitulo', type: 'string', example: 'Breve subtítulo'),
        new OA\Property(property: 'descricao', type: 'string', example: 'Descrição do projeto'),
        new OA\Property(property: 'objetivos', type: 'string', example: 'Objetivos do projeto'),
        new OA\Property(property: 'tecnologias', type: 'string', example: 'PHP, Laravel'),
        new OA\Property(property: 'ano_inicio', type: 'integer', example: 2023),
        new OA\Property(property: 'ano_fim', type: 'integer', example: 2024),
        new OA\Property(property: 'financiamento', type: 'string', example: 'FAPESP')
    ]
)]
/** @use HasFactory<ProjectFactory> */
class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo', 'areas', 'subtitulo', 'descricao', 'objetivos', 'tecnologias', 'ano_inicio', 'ano_fim', 'financiamento'
    ];

    protected $casts = [
        'areas' => 'array',
    ];

    public function members()
    {
        return $this->belongsToMany(Member::class);
    }
}
