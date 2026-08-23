<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ProjectService;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

class ProjectController extends Controller
{
    private ProjectService $service;

    public function __construct(ProjectService $service)
    {
        $this->service = $service;
    }

    #[OA\Get(
        path: '/api/projects',
        tags: ['Project'],
        responses: [new OA\Response(response: 200, description: 'OK', content: new OA\JsonContent(type: 'array', items: new OA\Items(ref: '#/components/schemas/Project')))]
    )]
    public function index(): JsonResponse
    {
        return response()->json($this->service->getAll());
    }

    #[OA\Get(
        path: '/api/projects/{id}',
        tags: ['Project'],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'OK', content: new OA\JsonContent(ref: '#/components/schemas/Project'))]
    )]
    public function show(int $id): JsonResponse
    {
        $p = $this->service->getById($id);
        if (!$p) return response()->json(['message' => 'Not found'], 404);
        return response()->json($p);
    }

    #[OA\Post(
        path: '/api/projects',
        tags: ['Project'],
        requestBody: new OA\RequestBody(content: new OA\JsonContent(ref: '#/components/schemas/Project')),
        responses: [new OA\Response(response: 201, description: 'Created', content: new OA\JsonContent(ref: '#/components/schemas/Project'))]
    )]
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'titulo' => 'required|string|max:255',
            'areas' => 'nullable',
            'subtitulo' => 'nullable|string|max:512',
            'descricao' => 'nullable|string',
            'objetivos' => 'nullable|string',
            'tecnologias' => 'nullable|string',
            'ano_inicio' => 'nullable|integer',
            'ano_fim' => 'nullable|integer',
            'financiamento' => 'nullable|string|max:255',
            'member_ids' => 'nullable|array',
            'member_ids.*' => 'integer|exists:members,id'
        ]);

        $project = $this->service->create($data);
        return response()->json($project, 201);
    }

    #[OA\Put(
        path: '/api/projects/{id}',
        tags: ['Project'],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        requestBody: new OA\RequestBody(content: new OA\JsonContent(ref: '#/components/schemas/Project')),
        responses: [new OA\Response(response: 200, description: 'OK', content: new OA\JsonContent(ref: '#/components/schemas/Project'))]
    )]
    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'titulo' => 'sometimes|required|string|max:255',
            'areas' => 'nullable',
            'subtitulo' => 'nullable|string|max:512',
            'descricao' => 'nullable|string',
            'objetivos' => 'nullable|string',
            'tecnologias' => 'nullable|string',
            'ano_inicio' => 'nullable|integer',
            'ano_fim' => 'nullable|integer',
            'financiamento' => 'nullable|string|max:255',
            'member_ids' => 'nullable|array',
            'member_ids.*' => 'integer|exists:members,id'
        ]);

        $project = $this->service->update($id, $data);
        if (!$project) return response()->json(['message' => 'Not found'], 404);
        return response()->json($project);
    }

    #[OA\Delete(
        path: '/api/projects/{id}',
        tags: ['Project'],
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
