<?php

namespace App\Http\Controllers;

use App\Enums\WatchingStatus;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;

class UserAnimeController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'anime_id' => ['required', 'integer'],
            'status' => ['required', Rule::enum (WatchingStatus::class)] ,
        ]);

        $anime = app(\App\Services\MyAnimeListService::class)
        ->getAnimeByMalId($validated['anime_id']);

        dd([
            'anime' => $anime,
            'status' => $validated['status'],
        ]);
    }
}
