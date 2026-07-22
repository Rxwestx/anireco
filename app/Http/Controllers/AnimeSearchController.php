<?php

namespace App\Http\Controllers;

use App\Services\MyAnimeListService;
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
        $keyword = $request->string('keyword')->toString();
        $animes = $keyword !==''
        ? $myAnimeListService->searchAnime($keyword)
        : [];

        return Inertia::render('search', [
            'keyword' => $keyword,
            'animes' => $animes,
        ]);
    }
}
