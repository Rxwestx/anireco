<?php

namespace App\Http\Controllers;

use App\Models\UserAnime;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class WatchNoteController extends Controller
{
    public function store(
        Request $request,
        UserAnime $userAnime,
    ): RedirectResponse{
        abort_unless(
            $userAnime->user_id === $request->user()->id,
            403,
        );

        $validated = $request->validate([
            'episode' => [
                'nullable',
                'integer',
                'min:1',
            ],
            'content' => [
                'required',
                'string',
                'max:500',
            ],
        ]);

        $userAnime->watchNotes()
            ->create([
                'episode' => $validated['episode'] ?? null,
                'content' => $validated['content'],
            ]);

        return back()->with(
            'success',
            '視聴メモを登録しました。',
        );
    }
}
