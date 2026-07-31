<?php

namespace App\Http\Controllers;

use App\Models\UserAnime;
use App\Models\WatchNote;
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
            'emotion_tag_ids' => [
                'array',
            ],
            'emotion_tag_ids.*' => [
                'integer',
            ],
        ]);

        $emotionTagIds = collect(
            $validated['emotion_tag_ids'] ?? [],
        )
            ->unique()
            ->values();

        $ownedEmotionTagIds = $request->user()
            ->emotionTags()
            ->whereIn('id', $emotionTagIds->all())
            ->pluck('id');

        abort_unless(
            $ownedEmotionTagIds->count() === $emotionTagIds->count(),
            403
        );

        $userAnime->watchNotes()->create([
                'episode' => $validated['episode'] ?? null,
                'content' => $validated['content'],
            ]);

        $userAnime->emotionTags()->sync(
            $ownedEmotionTagIds->all()
        );

        return back()->with(
            'success',
            '視聴メモを登録しました。',
        );
    }

    public function update(
        Request $request,
        UserAnime $userAnime,
        WatchNote $watchNote,
    ): RedirectResponse{
        abort_unless(
            $userAnime->user_id === $request->user()->id,
            403,
        );

        abort_unless(
            $watchNote->user_anime_id === $userAnime->id,
            404,
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

        $watchNote->update([
            'episode' => $validated['episode'] ?? null,
            'content' => $validated['content'],
        ]);

        return back()->with(
            'success',
            '視聴メモを更新しました。',
        );
    }

    public function destroy(
        Request $request,
        UserAnime $userAnime,
        WatchNote $watchNote,
    ): RedirectResponse{
        abort_unless(
            $userAnime->user_id === $request->user()->id,
            403,
        );

        abort_unless(
            $watchNote->user_anime_id === $userAnime->id,
            404,
        );

        $watchNote->delete();

        return back()->with(
            'success',
            '視聴メモを削除しました。',
        );
    }
}
