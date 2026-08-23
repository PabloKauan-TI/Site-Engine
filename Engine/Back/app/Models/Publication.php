<?php

namespace App\Models;

use Database\Factories\PublicationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'Publication',
    type: 'object',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'titulo', type: 'string', example: 'Título do artigo'),
        new OA\Property(property: 'tipo', type: 'string', example: 'Journal'),
        new OA\Property(property: 'autores', type: 'string', example: 'Silva, A.; Costa, R.'),
        new OA\Property(property: 'onde_publicado', type: 'string', example: 'Revista X'),
        new OA\Property(property: 'ano', type: 'integer', example: 2024),
        new OA\Property(property: 'doi', type: 'string', example: '10.1234/abcd.2024')
    ]
)]
/** @use HasFactory<PublicationFactory> */
class Publication extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo', 'tipo', 'autores', 'onde_publicado', 'ano', 'doi', 'resumo', 'palavras_chave'
    ];

    public function members(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Member::class);
    }
}
