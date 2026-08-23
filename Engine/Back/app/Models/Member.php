<?php

namespace App\Models;

use Database\Factories\MemberFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OpenApi\Attributes as OA;

//Docs Swagger
#[OA\Schema(
    schema: 'Member',
    type: 'object',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'nome', type: 'string', example: 'John Doe'),
        new OA\Property(property: 'email', type: 'string', example: 'john.doe@example.com'),
        new OA\Property(property: 'biografia', type: 'string', example: 'Biografia do membro'),
        new OA\Property(property: 'funcao', type: 'string', example: 'Função do membro'),
        new OA\Property(property: 'formacao', type: 'string', example: 'Formação do membro'),
        new OA\Property(property: 'linkedin', type: 'string', example: 'johndoe'),
        new OA\Property(property: 'lattes', type: 'string', example: '1234567890'),
        new OA\Property(property: 'orcid', type: 'string', example: '0000-0002-1825-0097'),
        new OA\Property(property: 'github', type: 'string', example: 'johndoe'),
        new OA\Property(property: 'url_foto', type: 'string', example: 'https://example.com/foto.jpg')
    ]
)]



#[Fillable(['nome', 'email', 'biografia', 'funcao', 'formacao', 'linkedin', 'lattes', 'orcid', 'github', 'url_foto'])]
/** @use HasFactory<MemberFactory> */
class Member extends Model
{
    use HasFactory;

    protected $fillable = ['nome', 'areas', 'funcao', 'email', 'biografia', 'formacao', 'linkedin', 'lattes', 'orcid', 'github', 'url_foto'];

    protected $casts = [
        'areas' => 'array',
    ];

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class);
    }

    public function publications(): BelongsToMany
    {
        return $this->belongsToMany(Publication::class);
    }
}
