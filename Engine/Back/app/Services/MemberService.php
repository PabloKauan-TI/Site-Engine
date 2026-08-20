<?php

namespace App\Services;

use App\Models\Member;
use Illuminate\Database\Eloquent\Collection;

class MemberService
{
    public function getAllMembers(): Collection
    {
        return Member::all();
    }

    public function getMemberById(int $id): ?Member
    {
        return Member::find($id);
    }

    public function createMember(array $data): Member
    {
        // normalize fields
        if (isset($data['areas']) && is_string($data['areas'])) {
            $data['areas'] = array_map('trim', explode(',', $data['areas']));
        }
        if (!isset($data['url_foto'])) {
            $data['url_foto'] = null;
        }
        return Member::create($data);
    }

    public function updateMember(int $id, array $data): ?Member
    {
        $member = Member::find($id);
        if ($member) {
            if (isset($data['areas']) && is_string($data['areas'])) {
                $data['areas'] = array_map('trim', explode(',', $data['areas']));
            }
            $member->update($data);
            return $member;
        }
        return null;
    }

    public function deleteMember(int $id): bool
    {
        $member = Member::find($id);
        if ($member) {
            return $member->delete();
        }
        return false;
    }
}