<?php

namespace App\Services;

use App\Models\AnimeMaster;

class AnimeSearchService
{
    /**
     * Create a new class instance.
     */
    public function searchLocal(string $keyword): array
    {
        $nomalizedKeyword = mb_convert_kana(
            trim($keyword),
            'KVas',
            'UTF-8',
        );

        return AnimeMaster::query()
            ->where(function ($query) use ($nomalizedKeyword) {
                $query
                    ->where('title', 'ILIKE', "%{$nomalizedKeyword}%")
                    ->orWhere('title_en', 'ILIKE', "%{$nomalizedKeyword}%")
                    ->orWhere('title_romaji', 'ILIKE', "%{$nomalizedKeyword}%");
            })
            ->get()
            ->map(function( AnimeMaster $animeMaster):array {
                return [
                    'id' => $animeMaster->mal_id,
                    'title' => $animeMaster->title,
                    'title_en' => $animeMaster->title_en,
                    'title_romaji' => $animeMaster->title_romaji,
                    'main_picture' => $animeMaster->cover_image
                    ? [
                        'large' => $animeMaster->cover_image,
                        'medium' => $animeMaster->cover_image,
                        ]
                        : null,
                    'start_date' => null,
                    'genres' => $animeMaster->genre
                    ? collect(explode(',', $animeMaster->genre))
                        ->map(fn( string $genre):array => [
                            'name' => trim($genre),
                            ])
                            ->values()
                            ->all()
                    : [],
                ];
            })
            ->values()
            ->all();
    }
}
