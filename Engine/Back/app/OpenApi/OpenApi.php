<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: 'Engine API',
    version: '1.0.0',
    description: 'API para gerenciar membros da equipe.',
    contact: new OA\Contact(
        name: 'Pablo Kauan M. Timbó',
        email: 'pablokauan.tech@gmail.com'
    )
),
    OA\Server(
        url: 'http://localhost:8000/api',
        description: 'Servidor local'
    )
]

class OpenApi
{
}