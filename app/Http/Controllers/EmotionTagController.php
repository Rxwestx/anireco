<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmotionTagController extends Controller
{
    public function index(Request $request): Response
    {
        $emotionTags = $request->user()
            ->emotionTags()
            ->latest()
            ->get([
                'id',
                'name',
                'created_at',
            ]);

        return Inertia::render('emotion-tags/index', [
            'emotionTags' => $emotionTags,
        ]);
    }
}
