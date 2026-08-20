<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\MemberService;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

class MemberController extends Controller
{
    private MemberService $service;

    public function __construct(MemberService $service)
    {
        $this->service = $service;
    }

    #[OA\Get(
        path: '/api/members',
        tags: ['Member'],
        responses: [
            new OA\Response(response: 200, description: 'OK', content: new OA\JsonContent(type: 'array', items: new OA\Items(ref: '#/components/schemas/Member')))
        ]
    )]
    public function index(): JsonResponse
    {
        $members = $this->service->getAllMembers();
        return response()->json($members);
    }

    #[OA\Get(
        path: '/api/members/{id}',
        tags: ['Member'],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'OK', content: new OA\JsonContent(ref: '#/components/schemas/Member'))]
    )]
    public function show(int $id): JsonResponse
    {
        $member = $this->service->getMemberById($id);
        if (!$member) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json($member);
    }

    #[OA\Post(
        path: '/api/members',
        tags: ['Member'],
        requestBody: new OA\RequestBody(content: new OA\JsonContent(ref: '#/components/schemas/Member')),
        responses: [new OA\Response(response: 201, description: 'Created', content: new OA\JsonContent(ref: '#/components/schemas/Member'))]
    )]
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nome' => 'required|string|max:255',
            'areas' => 'nullable',
            'funcao' => 'nullable|string|max:255',
            'email' => 'required|email|unique:members,email',
            'biografia' => 'nullable|string',
            'formacao' => 'nullable|string|max:255',
            'linkedin' => 'nullable|string|max:255',
            'lattes' => 'nullable|string|max:255',
            'url_foto' => 'nullable|string',
            'foto' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('members', 'public');

            $data['url_foto'] = 'https://enginelab.ufc.br/back/storage/' . $path;
        }

        $member = $this->service->createMember($data);
        return response()->json($member, 201);
    }

    #[OA\Put(
        path: '/api/members/{id}',
        tags: ['Member'],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        requestBody: new OA\RequestBody(content: new OA\JsonContent(ref: '#/components/schemas/Member')),
        responses: [new OA\Response(response: 200, description: 'OK', content: new OA\JsonContent(ref: '#/components/schemas/Member'))]
    )]
    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'areas' => 'nullable',
            'funcao' => 'nullable|string|max:255',
            'email' => 'sometimes|required|email|unique:members,email,' . $id,
            'biografia' => 'nullable|string',
            'formacao' => 'nullable|string|max:255',
            'linkedin' => 'nullable|string|max:255',
            'lattes' => 'nullable|string|max:255',
            'url_foto' => 'nullable|string',
            'foto' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('members', 'public');

            $data['url_foto'] = 'https://enginelab.ufc.br/back/storage/' . $path;
        }

        $member = $this->service->updateMember($id, $data);
        if (!$member) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json($member);
    }

    #[OA\Delete(
        path: '/api/members/{id}',
        tags: ['Member'],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 204, description: 'No Content')]
    )]
    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->service->deleteMember($id);
        if (!$deleted) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json(null, 204);
    }

    public function importCsv(Request $request): JsonResponse
    {
        $request->validate([
            'csv' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        $file = $request->file('csv');
        $handle = fopen($file->getRealPath(), 'r');

        // Read and normalize header row
        $rawHeader = fgetcsv($handle, 0, ',');
        if ($rawHeader === false) {
            fclose($handle);
            return response()->json(['message' => 'Arquivo CSV vazio ou inválido.'], 422);
        }

        // Normalize headers: remove BOM, trim, lowercase
        $header = array_map(function ($col) {
            return strtolower(trim(preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $col)));
        }, $rawHeader);

        $created = [];
        $skipped = [];
        $errors  = [];
        $row = 0;

        while (($line = fgetcsv($handle, 0, ',')) !== false) {
            $row++;

            if (count($line) !== count($header)) {
                $errors[] = "Linha $row: número de colunas não corresponde ao cabeçalho.";
                continue;
            }

            $data = array_combine($header, $line);

            // Map flexible column names to model fields
            $nome    = trim($data['nome'] ?? $data['name'] ?? $data['nome completo'] ?? '');
            $email   = trim($data['email'] ?? '');
            $funcao  = trim($data['funcao'] ?? $data['função'] ?? $data['cargo'] ?? $data['role'] ?? '');
            $formacao = trim($data['formacao'] ?? $data['formação'] ?? $data['area'] ?? $data['área'] ?? '');
            $biografia = trim($data['biografia'] ?? $data['bio'] ?? '');
            $linkedin  = trim($data['linkedin'] ?? '');
            $lattes    = trim($data['lattes'] ?? '');
            $url_foto  = trim($data['url_foto'] ?? $data['foto'] ?? $data['photo'] ?? '');

            if (empty($nome) || empty($email)) {
                $errors[] = "Linha $row: campos 'nome' e 'email' são obrigatórios.";
                continue;
            }

            if (!\App\Models\Member::where('email', $email)->exists()) {
                $member = $this->service->createMember([
                    'nome'      => $nome,
                    'email'     => $email,
                    'funcao'    => $funcao,
                    'formacao'  => $formacao,
                    'biografia' => $biografia,
                    'linkedin'  => $linkedin,
                    'lattes'    => $lattes,
                    'url_foto'  => $url_foto,
                ]);
                $created[] = $member;
            } else {
                $skipped[] = $email;
            }
        }

        fclose($handle);

        return response()->json([
            'message'  => 'Importação concluída.',
            'criados'  => count($created),
            'ignorados' => count($skipped),
            'erros'    => $errors,
            'membros'  => $created,
        ], 201);
    }
}
