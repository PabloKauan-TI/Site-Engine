<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use OpenApi\Attributes as OA;

class UserController extends Controller
{
    private UserService $service;

    public function __construct(UserService $service)
    {
        $this->service = $service;
    }

    #[OA\Post(
        path: '/api/users/login',
        tags: ['User'],
        requestBody: new OA\RequestBody(content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'email', type: 'string', format: 'email'),
                new OA\Property(property: 'password', type: 'string', format: 'password'),
            ],
            required: ['email', 'password']
        )),
        responses: [
            new OA\Response(response: 200, description: 'Authenticated', content: new OA\JsonContent(type: 'object')),
            new OA\Response(response: 401, description: 'Unauthorized')
        ]
    )]
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        $user = $this->service->login($data);

        if (!$user) {
            return response()->json(['message' => 'Credenciais inválidas'], 401);
        }

        if ($request->hasSession()) {
            Auth::login($user, true);
            $request->session()->regenerate();
        }

        return response()->json(['user' => $user]);
    }

    #[OA\Post(
        path: '/api/users/logout',
        tags: ['User'],
        responses: [
            new OA\Response(response: 204, description: 'Logged out'),
        ]
    )]
    public function logout(Request $request): JsonResponse
    {
        if ($request->hasSession()) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json(null, 204);
    }

    #[OA\Get(
        path: '/api/users',
        tags: ['User'],
        responses: [
            new OA\Response(response: 200, description: 'List of users', content: new OA\JsonContent(type: 'array', items: new OA\Items(ref: '#/components/schemas/User')))
        ]
    )]
    public function index(): JsonResponse
    {
        return response()->json($this->service->getAllUsers());
    }

    #[OA\Get(
        path: '/api/users/{id}',
        tags: ['User'],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [
            new OA\Response(response: 200, description: 'User found', content: new OA\JsonContent(ref: '#/components/schemas/User')),
            new OA\Response(response: 404, description: 'Not found')
        ]
    )]
    public function show(int $id): JsonResponse
    {
        $user = $this->service->getUserById($id);
        if (!$user) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json($user);
    }

    #[OA\Post(
        path: '/api/users',
        tags: ['User'],
        requestBody: new OA\RequestBody(content: new OA\JsonContent(
            ref: '#/components/schemas/User'
        )),
        responses: [
            new OA\Response(response: 201, description: 'Created', content: new OA\JsonContent(ref: '#/components/schemas/User'))
        ]
    )]
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        $user = $this->service->createUser($data);

        return response()->json($user, 201);
    }

    #[OA\Put(
        path: '/api/users/{id}',
        tags: ['User'],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        requestBody: new OA\RequestBody(content: new OA\JsonContent(ref: '#/components/schemas/User')),
        responses: [
            new OA\Response(response: 200, description: 'Updated', content: new OA\JsonContent(ref: '#/components/schemas/User')),
            new OA\Response(response: 404, description: 'Not found')
        ]
    )]
    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $id,
            'password' => 'sometimes|nullable|string|min:8',
        ]);

        $user = $this->service->updateUser($id, $data);

        if (!$user) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json($user);
    }

    #[OA\Delete(
        path: '/api/users/{id}',
        tags: ['User'],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [
            new OA\Response(response: 204, description: 'Deleted'),
            new OA\Response(response: 404, description: 'Not found')
        ]
    )]
    public function destroy(int $id): JsonResponse
    {
        if (!$this->service->deleteUser($id)) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json(null, 204);
    }
}
