<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;


class MyAnimeListService
{
    /**
     * Create a new class instance.
     */
    public function searchAnime(
        string $keyword,
        int $limit = 20,
        int $offset = 0
    ): array

    {
        $normalizedKeyword = mb_convert_kana(
            trim($keyword),
            'KVas',
            'UTF-8'
        );

        $response = Http::timeout(10)
        ->withHeaders([
            'X-MAL-CLIENT-ID' => config('services.myanimelist.client_id'),
        ])->get('https://api.myanimelist.net/v2/anime', [
            'q' => $normalizedKeyword,
            'limit' => $limit,
            'offset' => $offset,
            'fields' => implode(',', [
                'id',
                'title',
                'alternative_titles',
                'main_picture',
                'start_date',
                'genres',
            ]),
        ]);

        if ($response->status() === 400) {
            return [];
        }
        $response->throw();
        $animeList = $response->json('data', []);

        $items = array_map(function (array $item):array {
            $anime = $item['node'];

            return [
                'id' => $anime['id'],
                'title' => $anime['alternative_titles']['ja'] ?? $anime['title'],
                'main_picture' => $anime['main_picture'] ?? null,
                'start_date' => $anime['start_date'] ?? null,
                'genres' => $anime['genres'] ?? [],
            ];
        }, $animeList);

        return [
            'items' => $items,
            'has_next_page' =>filled($response->json('paging.next')),
        ];
    }

    public function getAnimeByMalId(int $malId): array
    {
        $response = Http::timeout(10)
        ->withHeaders([
            'X-MAL-CLIENT-ID' => config('services.myanimelist.client_id'),
        ])->get("https://api.myanimelist.net/v2/anime/{$malId}", [
            'fields' => implode(',', [
                'id',
                'title',
                'alternative_titles',
                'main_picture',
                'start_date',
                'synopsis',
                'genres',
                'source',
                'num_episodes',
                ]),
        ]);

        $response->throw();
        // JSONレスポンスを配列として取得
        $anime = $response->json();

        return [
            'id' => $anime['id'],
            'title' => $anime['alternative_titles'] ['ja'] ??
            $anime['title'],
            'main_picture' => $anime['main_picture'] ?? null,
            'start_date' => $anime['start_date'] ?? null,
            'genres' => $anime['genres'] ?? [],
            'synopsis' => preg_replace(
                '/\s*\[Written by MAL Rewrite\]\s*$/',
                '',
                $anime['synopsis'] ?? '',
            ),
            'source' => $anime['source'] ?? null,
            'num_episodes' => $anime['num_episodes'] ?? null,
            'broadcast_year' => ($anime['start_date'] ?? null)
                ? (int)substr($anime['start_date'], 0, 4)
                : null,
        ];
    }

    public function getSeasonalAnime(
        int $year,
        string $season,
        int $limit =10,
    ): array{
        $response = Http::timeout(10)
        ->withHeaders([
            'X-MAL-CLIENT-ID' => config('services.myanimelist.client_id'),
        ])->get("https://api.myanimelist.net/v2/anime/season/{$year}/{$season}",
            [
                'limit' => $limit,
                'sort' => 'anime_num_list_users',
                'fields' => implode(',', [
                    'id',
                    'title',
                    'alternative_titles',
                    'main_picture',
                    'start_date',
                    'genres',
                    'mean',
                    'status',
                ]),
            ],
        );

        if ($response->status() === 400) {
            return [];
        }
        $response->throw();

        $animeList = $response->json('data', []);

        $animeMonths = match($season) {
            'winter' => [1, 2, 3],
            'spring' => [4, 5, 6],
            'summer' => [7, 8, 9],
            'fall' => [10, 11, 12],
            default => [],
        };

        $animeList = array_filter(
            $animeList,
            function (array $item) use ($animeMonths, $year): bool {
            $startDate = $item['node']['start_date'] ?? null;

            if (!$startDate) {
                return false;
            }
            $startYear = (int)substr($startDate, 0, 4);
            $startMonth = (int)substr($startDate, 5, 2);

            return $startYear === $year
                && in_array($startMonth, $animeMonths,true);
            },
        );

        return array_values(
            array_map(function (array $item):array {
                $anime = $item['node'];

                return [
                    'id' => $anime['id'],
                    'title' => $anime['alternative_titles']['ja']
                        ?? $anime['title'],
                    'main_picture' => $anime['main_picture'] ?? null,
                    'start_date' => $anime['start_date'] ?? null,
                    'genres' => $anime['genres'] ?? [],
                    'mean' => $anime['mean'] ?? null,
                    'status' => $anime['status'] ?? null,
                ];
            }, $animeList),
        );
    }
}
