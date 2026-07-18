<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $userAnimes = $request->user()
        ->userAnimes()
        ->with('animeMaster')
        ->latest()
        ->get()
        ->map(function ($userAnime) {
            return [
                'id' => $userAnime->id,
                'status' => $userAnime->status->value,
                'statusLabel' => $userAnime->status->label(),
                'created_at' => $userAnime->created_at?->format('Y-m-d'),
                'anime_master' =>[
                    'id' => $userAnime->anime_master_id,
                    'anilist_id' => $userAnime->animeMaster->anilist_id,
                    'title' => $userAnime->animeMaster->title,
                    'cover_image' => $userAnime->animeMaster->cover_image,
                    'description' => $userAnime->animeMaster->description,
                    'genre' => $userAnime->animeMaster->genre,
                    'broadcast_year' => $userAnime->animeMaster->broadcast_year,
                ],
            ];
        });

        return Inertia::render('dashboard', [
            'userAnimes' => $userAnimes,
            'recentlyAdded' => $userAnimes->take(3)->values(),
        ]);
    }
}
