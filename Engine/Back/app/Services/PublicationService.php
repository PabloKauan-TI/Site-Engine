<?php

namespace App\Services;

use App\Models\Publication;
use Illuminate\Database\Eloquent\Collection;

class PublicationService
{
    public function getAll(): Collection
    {
        return Publication::all();
    }

    public function getById(int $id): ?Publication
    {
        return Publication::find($id);
    }

    public function create(array $data): Publication
    {
        return Publication::create($data);
    }

    public function update(int $id, array $data): ?Publication
    {
        $p = Publication::find($id);
        if (!$p) return null;
        $p->update($data);
        return $p;
    }

    public function delete(int $id): bool
    {
        $p = Publication::find($id);
        if (!$p) return false;
        return $p->delete();
    }
}
