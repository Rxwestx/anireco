<?php
namespace App\Http\Controllers;

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

        return Inertia::render('welcome',[
            'seasonalAnime' => $seasonalAnime,
            'seasonYear' => $year,
            'seasonLabel' => $seasonLabel,
        ]);
    }
}
