<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserAnimeController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'anime_id' => ['required', 'integer'],
        ]);

        $anime = app(\App\Services\MyAnimeListService::class)
        ->getAnimeByMalId($validated['anime_id']);

        dd($anime);
    }
}
