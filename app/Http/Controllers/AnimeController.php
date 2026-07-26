<?php

namespace App\Http\Controllers;

use App\Models\UserAnime;
use App\Services\MyAnimeListService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;


class AnimeController extends Controller
{
    public function show(
        Request $request,
        int $malId,
         MyAnimeListService $myAnimeListService,
         ): Response{
        $anime = $myAnimeListService->getAnimeByMalId($malId);

        $userAnime = null;

        if ($request->user()) {
            $userAnime = UserAnime::query()
                ->where('user_id', $request->user()->id)
                ->whereHas('animeMaster', function ($query) use ($malId) {
                    $query->where('mal_id', $malId);
                })
                ->first();
        }
        
        return Inertia::render('animes/show', [
            'anime' =>[
                ...$anime,
                'user_anime_id' => $userAnime?->id,
                'registered_status' => $userAnime?->status->value,
            ],
        ]);
    }
}
