<?php

namespace App\Services;

use App\Models\Publication;
use Illuminate\Database\Eloquent\Collection;

class PublicationService
{
    public function getAll(): Collection
    {
        return Publication::with('members')->get();
    }

    public function getById(int $id): ?Publication
    {
        return Publication::with('members')->find($id);
    }

    public function create(array $data): Publication
    {
        $memberIds = $data['member_ids'] ?? [];
        unset($data['member_ids']);
        
        $p = Publication::create($data);
        if (!empty($memberIds)) {
            $p->members()->sync($memberIds);
        }
        
        return $p->load('members');
    }

    public function update(int $id, array $data): ?Publication
    {
        $p = Publication::find($id);
        if (!$p) return null;
        
        $memberIds = $data['member_ids'] ?? null;
        unset($data['member_ids']);
        
        $p->update($data);
        
        if ($memberIds !== null) {
            $p->members()->sync($memberIds);
        }
        
        return $p->load('members');
    }

    public function delete(int $id): bool
    {
        $p = Publication::find($id);
        if (!$p) return false;
        return $p->delete();
    }
}
