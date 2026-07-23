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
        $response = Http::withHeaders([
            'X-MAL-CLIENT-ID' => config('services.myanimelist.client_id'),
        ])->get('https://api.myanimelist.net/v2/anime', [
            'q' => $keyword,
            'limit' => 20,
            'fields' => 'id,title,main_picture,start_date,genres',
        ]);

        $response->throw();
        return $response->json('data', []);
    }

    public function getAnimeByMalId(int $malId): array
    {
        $response = Http::withHeaders([
            'X-MAL-CLIENT-ID' => config('services.myanimelist.client_id'),
        ])->get("https://api.myanimelist.net/v2/anime/{$malId}", [
            'fields' => 'id,title,main_picture,start_date,genres,synopsis',
        ]);

        $response->throw();
        return $response->json();
    }
}
