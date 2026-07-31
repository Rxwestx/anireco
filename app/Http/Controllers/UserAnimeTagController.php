<?php

namespace App\Http\Controllers;

use App\Models\EmotionTag;
use App\Models\UserAnime;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UserAnimeTagController extends Controller
{
    public function store(
        Request $request,
        UserAnime $userAnime
    ): RedirectResponse{
        abort_unless(
            $userAnime->user_id === $request->user()->id,
            403,
        );

        $validated = $request->validate([
            'emotion_tag_id' => [
                'required',
                'integer',
            ],
        ]);

        $emotionTag = $request->user()
            ->emotionTags()
            ->findOrFail($validated['emotion_tag_id']);


        $userAnime->emotionTags()
            ->syncWithoutDetaching([
                $emotionTag->id,
            ]);

        return back()->with(
            'success',
            '感情タグを登録しました。',
        );
    }

    public function destroy(
        Request $request,
        UserAnime $userAnime,
        EmotionTag $emotionTag
    ): RedirectResponse{
        abort_unless(
            $userAnime->user_id === $request->user()->id,
            403,
        );

        abort_unless(
            $emotionTag->user_id === $request->user()->id,
            403,
        );

        $userAnime->emotionTags()
            ->detach($emotionTag->id);

        return back()->with(
            'success',
            '感情タグを解除しました。',
        );
    }
}
