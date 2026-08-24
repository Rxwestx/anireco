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
        $searchApiError = null;

        if($keyword !=='') {
            try {
                $seasonSearch = $this->parseSeasonSearch($keyword);

                if ($seasonSearch) {
                    if($seasonSearch['season']) {
                        $allAnimes = $myAnimeListService->getSeasonalAnime(
                            $seasonSearch['year'],
                            $seasonSearch['season'],
                            100,
                        );
                    } else {
                        $allAnimes = [];

                        foreach(
                            ['winter', 'spring', 'summer', 'fall']
                            as $searchSeason
                        ) {
                            $allAnimes = array_merge(
                                $allAnimes,
                                $myAnimeListService->getSeasonalAnime(
                                    $seasonSearch['year'],
                                    $searchSeason,
                                    100,
                                ),
                            );
                        }
                    }
                } else {
                    $allAnimes = $myAnimeListService->searchAnime($keyword);
                }

                $searchTotal = count($allAnimes);
                $searchTotalPages = (int) ceil($searchTotal / $perPage);
                if (
                    $searchTotalPages > 0
                    && $page > $searchTotalPages
                    ) {
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

        if($keyword === '') {
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
            'seasonalAnime' => $seasonalAnime,
            'seasonYear' => $year,
            'seasonLabel' => $seasonLabel,
            'searchApiError'=> $searchApiError,
            'seasonalApiError'=> $seasonalApiError,
            'searchPage' => $page,
            'searchTotal' => $searchTotal,
            'searchTotalPages' => $searchTotalPages,
        ]);
    }

    private function parseSeasonSearch(string $keyword): ?array
    {
        $normalizedKeyword = mb_convert_kana(
            trim($keyword),
            'KVas',
            'UTF-8',
        );

        $seasonMap = [
            '冬' => 'winter',
            '春' => 'spring',
            '夏' => 'summer',
            '秋' => 'fall',
        ];

        // 例：2026年春、2026 春、2026年春アニメ
        if (preg_match(
            '/^(?<year>\d{4})\s*年?\s*(?<season>[冬春夏秋])(?:の?アニメ)?$/u',
            $normalizedKeyword,
            $matches,
            )) {
            return [
                'year' => (int) $matches['year'],
                'season' => $seasonMap[$matches['season']],
            ];
        }

        // 例：春アニメ、春のアニメ
        if (preg_match(
            '/^(?<season>[冬春夏秋])(?:の?アニメ)?$/u',
            $normalizedKeyword,
            $matches,
            )) {
            return [
            'year' => now()->year,
            'season' => $seasonMap[$matches['season']],
            ];
        }

        // 例：2026、2026年
        if (preg_match(
            '/^(?<year>\d{4})\s*年?$/u',
            $normalizedKeyword,
            $matches,
            )) {
                return[
                    'year' => (int) $matches['year'],
                    'season' => null,
                ];
            }

        return null;
    }
}


