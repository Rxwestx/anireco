<?php

namespace App\Http\Controllers;

use App\Services\MyAnimeListService;
use App\Models\UserAnime;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

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
        $page = max(1, $request->integer('page', 1));
        $perPage = 20;

        $animes =[];
        $searchTotal = 0;
        $searchTotalPages = 0;
        $searchIsTruncated = false;
        $searchApiError = null;

        if($keyword !=='') {
            try {
                $searchResult = $myAnimeListService->searchAnime($keyword);

                $allAnimes = $searchResult['items'];
                $searchIsTruncated = $searchResult['is_truncated'];

                $searchTotal = count($allAnimes);
                $searchTotalPages = (int) ceil($searchTotal / $perPage);
                if ($searchTotalPages > 0 && $page > $searchTotalPages) {
                    $page = $searchTotalPages;
                }
                $animes = array_slice(
                    $allAnimes,
                    ($page - 1) * $perPage,
                    $perPage,
                );
            } catch (Throwable $e) {
                report($e);
                $searchApiError =
                '現在アニメ情報を取得できません。時間をおいて再度お試しください。';
            }
        }

        $registeredUserAnimes = collect();

        $year = now()->year;
        $month = now()->month;

        [$season,$seasonLabel] = match (true) {
            $month <= 3 => ['winter', '冬'],
            $month <= 6 => ['spring', '春'],
            $month <= 9 => ['summer', '夏'],
            $month <= 12 => ['fall', '秋'],
        };

        $seasonalAnime =[];
        $seasonalApiError = null;
        try {
            $seasonalAnime = $myAnimeListService->getSeasonalAnime(
                    $year,
                    $season,
                    100,
                );
        } catch (Throwable $e) {
            report($e);
            $seasonalApiError =
            '現在アニメ情報を取得できません。時間をおいて再度お試しください。';
        }


        if ($request->user()) {
            $malIds = collect($animes)
            ->pluck('id')
            ->merge(
                collect($seasonalAnime)
                ->pluck('id')
            )
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
                    $request->user()->id,
                )
                ->whereIn('anime_masters.mal_id', $malIds)
                ->get([
                'user_animes.id',
                'user_animes.status',
                'anime_masters.mal_id'
                ])
                ->keyBy('mal_id');
        }
        // 検索結果のアニメリストに登録状態を追加
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

        return Inertia::render('search', [
            'keyword' => $keyword,
            'animes' => $animes,
            'registeredStatus' => $registeredUserAnimes,
            'seasonalAnime' => $seasonalAnime,
            'seasonYear' => $year,
            'seasonLabel' => $seasonLabel,
            'searchApiError'=> $searchApiError,
            'seasonalApiError'=> $seasonalApiError,
            'searchPage' => $page,
            'searchTotal' => $searchTotal,
            'searchTotalPages' => $searchTotalPages,
            'searchIsTruncated' => $searchIsTruncated,
        ]);
    }
}
