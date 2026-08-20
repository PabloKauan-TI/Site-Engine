<?php

namespace App\Models;

use Database\Factories\NewsFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'News',
    type: 'object',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'titulo', type: 'string', example: 'Lançamento do projeto'),
        new OA\Property(property: 'tipo', type: 'string', example: 'Evento'),
        new OA\Property(property: 'subtitulo', type: 'string', example: 'Subtítulo breve'),
        new OA\Property(property: 'data', type: 'string', format: 'date', example: '2026-08-11'),
        new OA\Property(property: 'corpo', type: 'string', example: 'Corpo da notícia')
    ]
)]
/** @use HasFactory<NewsFactory> */
class News extends Model
{
    use HasFactory;

    protected $table = 'news';

    protected $fillable = [
        'titulo', 'tipo', 'subtitulo', 'data', 'corpo'
    ];

    protected $casts = [
        'data' => 'date',
    ];
}
