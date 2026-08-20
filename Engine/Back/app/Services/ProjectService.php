<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

class ProjectService
{
    public function getAll(): Collection
    {
        return Project::all();
    }

    public function getById(int $id): ?Project
    {
        return Project::find($id);
    }

    public function create(array $data): Project
    {
        if (isset($data['areas']) && is_string($data['areas'])) {
            $data['areas'] = array_map('trim', explode(',', $data['areas']));
        }
        return Project::create($data);
    }

    public function update(int $id, array $data): ?Project
    {
        $project = Project::find($id);
        if (!$project) return null;
        if (isset($data['areas']) && is_string($data['areas'])) {
            $data['areas'] = array_map('trim', explode(',', $data['areas']));
        }
        $project->update($data);
        return $project;
    }

    public function delete(int $id): bool
    {
        $project = Project::find($id);
        if (!$project) return false;
        return $project->delete();
    }
}
