<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PublicationService;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

class PublicationController extends Controller
{
    private PublicationService $service;

    public function __construct(PublicationService $service)
    {
        $this->service = $service;
    }

    #[OA\Get(
        path: '/api/publications',
        tags: ['Publication'],
        responses: [new OA\Response(response: 200, description: 'OK', content: new OA\JsonContent(type: 'array', items: new OA\Items(ref: '#/components/schemas/Publication')))]
    )]
    public function index(): JsonResponse
    {
        return response()->json($this->service->getAll());
    }

    #[OA\Get(
        path: '/api/publications/{id}',
        tags: ['Publication'],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'OK', content: new OA\JsonContent(ref: '#/components/schemas/Publication'))]
    )]
    public function show(int $id): JsonResponse
    {
        $p = $this->service->getById($id);
        if (!$p) return response()->json(['message' => 'Not found'], 404);
        return response()->json($p);
    }

    #[OA\Post(
        path: '/api/publications',
        tags: ['Publication'],
        requestBody: new OA\RequestBody(content: new OA\JsonContent(ref: '#/components/schemas/Publication')),
        responses: [new OA\Response(response: 201, description: 'Created', content: new OA\JsonContent(ref: '#/components/schemas/Publication'))]
    )]
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'titulo' => 'required|string|max:255',
            'tipo' => 'nullable|string|max:255',
            'autores' => 'nullable|string',
            'onde_publicado' => 'nullable|string|max:255',
            'ano' => 'nullable|integer',
            'doi' => 'nullable|string|max:255',
            'resumo' => 'nullable|string',
            'palavras_chave' => 'nullable|string|max:512',
            'member_ids' => 'nullable|array',
            'member_ids.*' => 'integer|exists:members,id'
        ]);

        $p = $this->service->create($data);
        return response()->json($p, 201);
    }

    #[OA\Put(
        path: '/api/publications/{id}',
        tags: ['Publication'],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        requestBody: new OA\RequestBody(content: new OA\JsonContent(ref: '#/components/schemas/Publication')),
        responses: [new OA\Response(response: 200, description: 'OK', content: new OA\JsonContent(ref: '#/components/schemas/Publication'))]
    )]
    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'titulo' => 'sometimes|required|string|max:255',
            'tipo' => 'nullable|string|max:255',
            'autores' => 'nullable|string',
            'onde_publicado' => 'nullable|string|max:255',
            'ano' => 'nullable|integer',
            'doi' => 'nullable|string|max:255',
            'resumo' => 'nullable|string',
            'palavras_chave' => 'nullable|string|max:512',
            'member_ids' => 'nullable|array',
            'member_ids.*' => 'integer|exists:members,id'
        ]);

        $p = $this->service->update($id, $data);
        if (!$p) return response()->json(['message' => 'Not found'], 404);
        return response()->json($p);
    }

    #[OA\Delete(
        path: '/api/publications/{id}',
        tags: ['Publication'],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 204, description: 'No Content')]
    )]
    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->service->delete($id);
        if (!$deleted) return response()->json(['message' => 'Not found'], 404);
        return response()->json(null, 204);
    }
}
