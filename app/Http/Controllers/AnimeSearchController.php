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

        $registeredStatuses = collect();

        if ($request->user() && $animes !== []) {
            $malIds = collect($animes)->pluck('id');

            $registeredStatuses = UserAnime::query()
                ->join(
                    'anime_masters',
                    'user_animes.anime_master_id',
                    '=',
                    'anime_masters.id',
                )
                ->where('user_animes.user_id', $request->user()->id)
                ->whereIn('anime_masters.mal_id', $malIds)
                ->pluck('user_animes.status' ,'anime_masters.mal_id');
        }

        $animes = collect($animes)
            ->map(function (array $anime) use ($registeredStatuses) {
                return [
                    ...$anime,
                    'registered_status' => $registeredStatuses->get($anime['id']),
                ];
            })
            ->values()
            ->all();


        return Inertia::render('search', [
            'keyword' => $keyword,
            'animes' => $animes,
            'registeredStatus' => $registeredStatuses,
        ]);
    }
}
