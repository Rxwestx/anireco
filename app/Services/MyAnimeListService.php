<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;


class MyAnimeListService
{
    /**
     * Create a new class instance.
     */
    public function searchAnime(string $keyword): array
    {
        $normalizedKeyword = mb_convert_kana(
            trim($keyword),
            'KVas',
            'UTF-8'
        );

        $response = Http::withHeaders([
            'X-MAL-CLIENT-ID' => config('services.myanimelist.client_id'),
        ])->get('https://api.myanimelist.net/v2/anime', [
            'q' => $normalizedKeyword,
            'limit' => 20,
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

        return array_map(function (array $item):array {
            $anime = $item['node'];

            return [
                'id' => $anime['id'],
                'title' => $anime['alternative_titles']['ja'] ?? $anime['title'],
                'main_picture' => $anime['main_picture'] ?? null,
                'start_date' => $anime['start_date'] ?? null,
                'genres' => $anime['genres'] ?? [],
            ];
        }, $animeList);
    }

    public function getAnimeByMalId(int $malId): array
    {
        $response = Http::withHeaders([
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
                ]),
        ]);

        $response->throw();
        // JSONレスポンスを配列として取得
        $anime = $response->json();

        return [
            'id' => $anime['id'],
            'title' => $anime['alternative_titles'] ['ja'] ?: $anime['title'],
            'main_picture' => $anime['main_picture'] ?? null,
            'start_date' => $anime['start_date'] ?? null,
            'genres' => $anime['genres'] ?? [],
            'synopsis' => preg_replace(
                '/\s*\[Written by MAL Rewrite\]\s*$/',
                '',
                $anime['synopsis'] ?? '',
            ),
            'source' => $anime['source'] ?? null,
        ];
    }
}
