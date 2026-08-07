<?php
namespace App\Http\Controllers;

use App\Models\UserAnime;
use App\Services\MyAnimeListService;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    public function index(
        MyAnimeListService $myAnimeListService
    ): Response{
        $year = now()->year;
        $month = now()->month;

        [$season,$seasonLabel] = match (true) {
            $month <= 3 => ['winter', '冬'],
            $month <= 6 => ['spring', '春'],
            $month <= 9 => ['summer', '夏'],
            $month <= 12 => ['fall', '秋'],
        };

        $seasonalAnime = $myAnimeListService
            ->getSeasonalAnime(
                $year,
                $season,
                50,
            );

        $seasonalAnime = array_slice(
            $seasonalAnime,
            0,
            10,
        );

        $registeredUserAnimes = collect();

        if (request()->user()) {
            $malIds = collect($seasonalAnime)
            ->pluck('id')
            ->unique()
            ->values();

            $registeredUserAnimes = UserAnime::query()
                ->join(
                    'anime_masters',
                    'user_animes.anime_master_id',
                    '=',
                    'anime_masters.id',
                )
                ->where(
                    'user_animes.user_id',
                    request()->user()->id
                )
                ->whereIn('anime_masters.mal_id', $malIds)
                ->get([
                    'user_animes.id',
                    'user_animes.status',
                    'anime_masters.mal_id',
                ])
                ->keyBy('mal_id');
        }

        // 今季アニメのリストに登録状態を追加
        $seasonalAnime = collect($seasonalAnime)
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

        return Inertia::render('welcome',[
            'seasonalAnime' => $seasonalAnime,
            'seasonYear' => $year,
            'seasonLabel' => $seasonLabel,
        ]);
    }
}
