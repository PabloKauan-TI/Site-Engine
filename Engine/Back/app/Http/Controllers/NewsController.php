<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\NewsService;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

class NewsController extends Controller
{
    private NewsService $service;

    public function __construct(NewsService $service)
    {
        $this->service = $service;
    }

    #[OA\Get(
        path: '/api/news',
        tags: ['News'],
        responses: [new OA\Response(response: 200, description: 'OK', content: new OA\JsonContent(type: 'array', items: new OA\Items(ref: '#/components/schemas/News')))]
    )]
    public function index(): JsonResponse
    {
        return response()->json($this->service->getAll());
    }

    #[OA\Get(
        path: '/api/news/{id}',
        tags: ['News'],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'OK', content: new OA\JsonContent(ref: '#/components/schemas/News'))]
    )]
    public function show(int $id): JsonResponse
    {
        $n = $this->service->getById($id);
        if (!$n) return response()->json(['message' => 'Not found'], 404);
        return response()->json($n);
    }

    #[OA\Post(
        path: '/api/news',
        tags: ['News'],
        requestBody: new OA\RequestBody(content: new OA\JsonContent(ref: '#/components/schemas/News')),
        responses: [new OA\Response(response: 201, description: 'Created', content: new OA\JsonContent(ref: '#/components/schemas/News'))]
    )]

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'titulo' => 'required|string|max:255',
            'tipo' => 'nullable|string|max:255',
            'subtitulo' => 'nullable|string|max:512',
            'data' => 'nullable|date',
            'corpo' => 'nullable|string',
            'image_url' => 'nullable|string|max:1024',
            'foto' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('news', 'public');
            $data['image_url'] = '/storage/' . $path;
        }

        $n = $this->service->create($data);
        return response()->json($n, 201);
    }

    #[OA\Put(
        path: '/api/news/{id}',
        tags: ['News'],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        requestBody: new OA\RequestBody(content: new OA\JsonContent(ref: '#/components/schemas/News')),
        responses: [new OA\Response(response: 200, description: 'OK', content: new OA\JsonContent(ref: '#/components/schemas/News'))]
    )]

    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'titulo' => 'sometimes|required|string|max:255',
            'tipo' => 'nullable|string|max:255',
            'subtitulo' => 'nullable|string|max:512',
            'data' => 'nullable|date',
            'corpo' => 'nullable|string',
            'image_url' => 'nullable|string|max:1024',
            'foto' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('news', 'public');
            $data['image_url'] = '/storage/' . $path;
        }

        $n = $this->service->update($id, $data);
        if (!$n) return response()->json(['message' => 'Not found'], 404);
        return response()->json($n);
    }

    #[OA\Delete(
        path: '/api/news/{id}',
        tags: ['News'],
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
