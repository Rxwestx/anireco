<?php

namespace App\Http\Controllers;

use App\Services\MyAnimeListService;
use Inertia\Inertia;
use Inertia\Response;


class AnimeController extends Controller
{
    public function show(
        int $malId,
         MyAnimeListService $myAnimeListService
         ): Response{
        $anime = $myAnimeListService->getAnimeByMalId($malId);

        return Inertia::render('animes/show', [
            'anime' => $anime,
        ]);
    }
}
