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
            'sort' => [
                'nullable',
                Rule::in([
                    'newest',
                    'oldest',
                    ]),
            ],
            'emotion_tag_ids' => [
                'nullable',
                'array',
            ],
            'emotion_tag_ids.*' => [
                'integer',
            ],
            'recommend_category' => [
                'nullable',
                'string',
                'max:255',
            ],
            'sort' =>[
                'nullable',
                Rule::in([
                    'newest',
                    'oldest',
                    'evaluation_desc',
                    'evaluation_asc',
                ]),
            ]
        ]);

        $status = $validated['status'] ?? null;
        $keyword = $validated['keyword'] ?? null;
        $sort = $validated['sort'] ?? 'newest';
        $emotionTagIds = $validated['emotion_tag_ids'] ?? [];
        $recommendCategory = $validated['recommend_category'] ?? null;

        // 感情タグIDが指定されている場合は、ログインユーザーが所有している感情タグかどうかを確認
        if ($emotionTagIds !== []) {
            $ownedEmotionTagCount = $request->user()
                ->emotionTags()
                ->whereIn('id', $emotionTagIds)
                ->count();

            abort_unless(
                $ownedEmotionTagCount === count($emotionTagIds),
                404,
            );
        }

        $hasRegisteredAnimes = $request->user()
        ->userAnimes()
        ->exists();

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
        ->with([
            'animeMaster',
            'emotionTags:id',
            ]);

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
        // 感情タグIDが指定されている場合は、指定された感情タグを持つ作品だけを取得
        foreach( $emotionTagIds as $emotionTagId ) {
            $userAnimesQuery->whereHas(
                'emotionTags',
                function ($query) use ($emotionTagId) {
                    $query->where(
                        'emotion_tags.id',
                        $emotionTagId,
                    );
                },
            );
        }

        if($recommendCategory) {
            $userAnimesQuery->whereHas(
                'review',
                function ($query) use ($recommendCategory) {
                    $query->where(
                        'recommend_category',
                        $recommendCategory,
                    );
                },
            );
        }

        if( $sort === 'oldest' ) {
            $userAnimesQuery->oldest();
        } else if( $sort === 'evaluation_desc' ) {
            $userAnimesQuery
                ->leftJoin('reviews', 'reviews.user_anime_id', '=', 'user_animes.id')
                ->orderByRaw('reviews.evaluation DESC NULLS LAST')
                ->select('user_animes.*');
        } else if( $sort === 'evaluation_asc') {
            $userAnimesQuery
                ->leftJoin('reviews', 'reviews.user_anime_id', '=', 'user_animes.id')
                ->orderByRaw('reviews.evaluation ASC NULLS LAST')
                ->select('user_animes.*');
        }
        else {
            $userAnimesQuery->latest();
        }

        $userAnimes = $userAnimesQuery
            ->get()
            ->map(function ($userAnime) {
            return [
                'id' => $userAnime->id,
                'status' => $userAnime->status->value,
                'statusLabel' => $userAnime->status->label(),
                'created_at' => $userAnime->created_at?->format('Y-m-d H:i:s'),
                'attachedEmotionTagIds' => $userAnime
                    ->emotionTags
                    ->pluck('id')
                    ->values()
                    ->all(),
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
            'hasRegisteredAnimes' => $hasRegisteredAnimes,
            'selectedSort' => $sort,
            'selectedRecommendCategory' => $recommendCategory,
            'emotionTags'=> $request->user()
                ->emotionTags()
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                ]),
            'selectedEmotionTagIds' => array_map(
                'intval',
                $emotionTagIds,
            ),
        ]);
    }
}
