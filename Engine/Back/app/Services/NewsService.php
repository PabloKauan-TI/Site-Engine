<?php

namespace App\Services;

use App\Models\News;
use Illuminate\Database\Eloquent\Collection;

class NewsService
{
    public function getAll(): Collection
    {
        return News::all();
    }

    public function getById(int $id): ?News
    {
        return News::find($id);
    }

    public function create(array $data): News
    {
        return News::create($data);
    }

    public function update(int $id, array $data): ?News
    {
        $n = News::find($id);
        if (!$n) return null;
        $n->update($data);
        return $n;
    }

    public function delete(int $id): bool
    {
        $n = News::find($id);
        if (!$n) return false;
        return $n->delete();
    }
}
