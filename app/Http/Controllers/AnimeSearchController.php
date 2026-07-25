<?php

namespace App\Http\Controllers;

use App\Services\MyAnimeListService;
use App\Models\AnimeMaster;
use App\Models\UserAnime;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnimeSearchController extends Controller
{
    public function index(
        Request $request,
        MyAnimeListService $myAnimeListService
    ): Response
    {
        $request->validate([
            'keyword' => ['nullable', 'string', 'min:2'],
        ]);

        $keyword = $request->string('keyword')->toString();
        $animes = $keyword !==''
        ? $myAnimeListService->searchAnime($keyword)
        : [];

        $registeredUserAnimes = collect();

        if ($request->user() && $animes !== []) {
            $malIds = collect($animes)->pluck('id');

            $registeredUserAnimes = UserAnime::query()
                ->join(
                    'anime_masters',
                    'user_animes.anime_master_id',
                    '=',
                    'anime_masters.id',
                )
                ->where('user_animes.user_id', $request->user()->id)
                ->whereIn('anime_masters.mal_id', $malIds)
                ->get([
                'user_animes.id',
                'user_animes.status',
                'anime_masters.mal_id'
                ])
                ->keyBy('mal_id');
        }

        $animes = collect($animes)
            ->map(function (array $anime) use ($registeredUserAnimes) {
                $registeredUserAnime = $registeredUserAnimes->get($anime['id']);

                return [
                    ...$anime,
                    'user_anime_id' => $registeredUserAnime?->id,
                    'registered_status' => $registeredUserAnime?->status->value,
                ];
            })
            ->values()
            ->all();


        return Inertia::render('search', [
            'keyword' => $keyword,
            'animes' => $animes,
            'registeredStatus' => $registeredUserAnimes,
        ]);
    }
}
