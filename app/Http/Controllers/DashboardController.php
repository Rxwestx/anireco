<?php

namespace App\Http\Controllers;

use App\Enums\WatchingStatus;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'status' => [
                'nullable',
                 Rule::enum(WatchingStatus::class)
            ],
            'keyword' => [
                'nullable',
                'string',
                'max:100',
            ],
        ]);

        $status = $validated['status'] ?? null;
        $keyword = $validated['keyword'] ?? null;

        // ログインユーザーの最近登録作品を3件取得
        $recentlyAdded = $request->user()
            ->userAnimes()
            ->with('animeMaster')
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($userAnime) {
                return [
                    'id' => $userAnime->id,
                    'status' => $userAnime->status->value,
                    'statusLabel' => $userAnime->status->label(),
                    'created_at' => $userAnime->created_at?->format(
                        'Y-m-d H:i:s'
                        ),
                    'anime_master' =>[
                        'id' => $userAnime->animeMaster->id,
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
            })
            ->values();

        // ログインユーザーの登録作品を全件取得
        $userAnimesQuery = $request->user()
        ->userAnimes()
        ->with('animeMaster')
        ->latest();

        // キーワードが指定されている場合だけ検索を実行
        if( $keyword ) {
            $userAnimesQuery->whereHas(
                'animeMaster',
                function ($query) use ($keyword) {
                    $query->where(
                        'title',
                        'ILIKE',
                        '%' . $keyword . '%',
                    );
                },
            );
        }

        if( $status ) {
            $userAnimesQuery->where('status', $status);
        }


        $userAnimes = $userAnimesQuery
            ->get()
            ->map(function ($userAnime) {
            return [
                'id' => $userAnime->id,
                'status' => $userAnime->status->value,
                'statusLabel' => $userAnime->status->label(),
                'created_at' => $userAnime->created_at?->format('Y-m-d H:i:s'),
                'anime_master' =>[
                    'id' => $userAnime->animeMaster->id,
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
        })
        ->values();

        return Inertia::render('dashboard', [
            'userAnimes' => $userAnimes,
            'recentlyAdded' => $recentlyAdded,
            'selectedStatus' => $status,
            'keyword' => $keyword,
        ]);
    }
}
