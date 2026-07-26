<?php

namespace App\Http\Controllers;

use App\Enums\WatchingStatus;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'status' => [
                'nullable',
                 Rule::enum(WatchingStatus::class)],
        ]);

        $status = $validated['status'] ?? null;

        // ログインユーザーの登録商品を全件取得
        $allUserAnimes = $request->user()
        ->userAnimes()
        ->with('animeMaster')
        ->latest()
        ->get()
        ->map(function ($userAnime) {
            return [
                'id' => $userAnime->id,
                'status' => $userAnime->status->value,
                'statusLabel' => $userAnime->status->label(),
                'created_at' => $userAnime->created_at?->format('Y-m-d H:i:s'),
                'anime_master' =>[
                    'id' => $userAnime->anime_master_id,
                    'mal_id' => $userAnime->animeMaster->mal_id,
                    'title' => $userAnime->animeMaster->title,
                    'cover_image' => $userAnime->animeMaster->cover_image,
                    'description' => $userAnime->animeMaster->description,
                    'genre' => $userAnime->animeMaster->genre,
                    'broadcast_year' => $userAnime
                        ->animeMaster
                        ->broadcast_year,
                ],
            ];
        });

        // ステータスが指定されている場合だけ一覧を絞り込む
        $userAnimes = $status
            ? $allUserAnimes->where('status', $status)
                ->where('status', $status)
                ->values()
            : $allUserAnimes->values();

        return Inertia::render('dashboard', [
            'userAnimes' => $userAnimes,
            'recentlyAdded' => $allUserAnimes->take(3)->values(),
            'selectedStatus' => $status,
        ]);
    }
}
