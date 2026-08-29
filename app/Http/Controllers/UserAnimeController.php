<?php

namespace App\Http\Controllers;

use App\Enums\WatchingStatus;
use App\Models\AnimeMaster;
use App\Models\UserAnime;
use App\Services\MyAnimeListService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;

class UserAnimeController extends Controller
{
    public function store(
        Request $request,
        MyAnimeListService $myAnimeListService,
    ):RedirectResponse{
        $validated = $request->validate([
            'anime_id' => ['required', 'integer'],
            'status' => ['required', Rule::enum (WatchingStatus::class)] ,
        ]);

        $anime = $myAnimeListService
        ->getAnimeByMalId($validated['anime_id']);

        $animeMaster = AnimeMaster::updateOrCreate(
            ['mal_id' => $anime['id']],
            [
                'title' => $anime['title'],
                'title_en' => $anime['title_en'] ?? null,
                'title_romaji' => $anime['title_romaji'] ?? null,
                'cover_image' => $anime['main_picture']['large']
                ?? $anime['main_picture']['medium'] ?? null,
                'description' => $anime['synopsis'] ?? null,
                'genre' => collect($anime['genres'] ?? [])
                ->pluck('name')
                ->implode(', '),
                'source' => $anime['source'] ?? null,
                'num_episodes' => $anime['num_episodes'] ?? null,
                'broadcast_year' => $anime['broadcast_year'] ?? null,
            ]
        );

        $userAnime = UserAnime::firstOrCreate(
            [
            'user_id' => $request->user()->id,
            'anime_master_id' => $animeMaster->id,
            ],
            [
            'status' => $validated['status'],
            ],
        );

        if (!$userAnime->wasRecentlyCreated) {
            return back()->withErrors([
                'anime' => 'このアニメ作品はすでに登録されています。',
            ]);
        }
        return back()->with('success', 'アニメ作品を登録しました！');
    }

    public function update(
        Request $request,
        UserAnime $userAnime,
    ):RedirectResponse {
        abort_unless(
            $userAnime->user_id === $request->user()->id,
            403
        );
        $validated = $request->validate([
            'status' => ['required', Rule::enum(WatchingStatus::class)],
        ]);

        $userAnime->update([
            'status' => $validated['status'],
        ]);

        return back()->with('success', 'アニメ作品のステータスを更新しました！');
    }
}
