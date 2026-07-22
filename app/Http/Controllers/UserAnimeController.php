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
        dd($validated);
    }
}
