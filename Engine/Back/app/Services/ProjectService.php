<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

class ProjectService
{
    public function getAll(): Collection
    {
        return Project::with('members')->get();
    }

    public function getById(int $id): ?Project
    {
        return Project::with('members')->find($id);
    }

    public function create(array $data): Project
    {
        if (isset($data['areas']) && is_string($data['areas'])) {
            $data['areas'] = array_map('trim', explode(',', $data['areas']));
        }
        $project = Project::create($data);
        if (isset($data['member_ids'])) {
            $project->members()->sync($data['member_ids']);
        }
        return $project->load('members');
    }

    public function update(int $id, array $data): ?Project
    {
        $project = Project::find($id);
        if (!$project) return null;
        if (isset($data['areas']) && is_string($data['areas'])) {
            $data['areas'] = array_map('trim', explode(',', $data['areas']));
        }
        $project->update($data);
        if (isset($data['member_ids'])) {
            $project->members()->sync($data['member_ids']);
        }
        return $project->load('members');
    }

    public function delete(int $id): bool
    {
        $project = Project::find($id);
        if (!$project) return false;
        return $project->delete();
    }
}
