<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\UserAnime;
use App\Services\DeepLService;
use App\Services\MyAnimeListService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;


class AnimeController extends Controller
{
    public function show(
        Request $request,
        int $malId,
        MyAnimeListService $myAnimeListService,
        DeepLService $deepLService,
        ): Response{
        $anime = $myAnimeListService->getAnimeByMalId($malId);

        $anime['synopsis'] = $deepLService->translateToJapanese($anime['synopsis'] ?? ''
        );

        $userAnime = null;
        $emotionTags = collect();
        $attachedEmotionTagIds = collect();
        $watchNotes = collect();
        $review = null;

        $publicReviews = Review::query()
            ->with([
                'userAnime.user:id,name',
            ])
            ->where('publish', true)
            ->where('is_hidden_by_admin', false)
            ->whereHas(
                'userAnime.animeMaster',
                function ($query) use ($malId) {
                        $query->where('mal_id', $malId);
                },
            )
            ->latest()
            ->limit(5)
            ->get()
            ->map(function (Review $review) {
                return [
                    'id' => $review->id,
                    'evaluation' => $review->evaluation,
                    'comment' => $review->comment,
                    'recommend_category' =>
                        $review->recommend_category,
                    'spoiler' => $review->spoiler,
                    'reviewer_name' =>
                        $review->userAnime->user->name,
                    'created_at' =>
                        $review->created_at?->format(
                            'Y-m-d H:i:s',
                        ),
                ];
            });

        if ($request->user()) {
            $userAnime = UserAnime::query()
                ->with([
                    'emotionTags',
                    'review',
                    'watchNotes' => function ($query) {
                        $query->latest();
                    },
                ])
                ->where('user_id', $request->user()->id)
                ->whereHas('animeMaster', function ($query) use ($malId) {
                    $query->where('mal_id', $malId);
                })
                ->first();

            $emotionTags = $request->user()
                ->emotionTags()
                ->latest()
                ->get([
                    'id',
                    'name',
                ]);

            $attachedEmotionTagIds = $userAnime?->emotionTags
                ->pluck('id')
                ?? collect();

            $watchNotes = $userAnime?->watchNotes
                ->map(function ($watchNote) {
                    return [
                        'id' => $watchNote->id,
                        'episode' => $watchNote->episode,
                        'content' => $watchNote->content,
                        'created_at' => $watchNote->created_at?->format(
                            'Y-m-d H:i:s'
                        ),
                    ];
                })
                ?? collect();

            $review = $userAnime?->review
                ? [
                    'id' => $userAnime->review->id,
                    'evaluation' => $userAnime->review->evaluation,
                    'comment' => $userAnime->review->comment,
                    'recommend_category' => $userAnime->review->recommend_category,
                    'publish' => $userAnime->review->publish,
                    'spoiler' => $userAnime->review->spoiler,
                    'is_hidden_by_admin' => $userAnime->review->is_hidden_by_admin,
                    'created_at' => $userAnime->review->created_at?->format(
                        'Y-m-d H:i:s'
                    ),
                    'updated_at' => $userAnime->review->updated_at?->format(
                        'Y-m-d H:i:s'
                    ),
                ]
                : null;
        }

        return Inertia::render('animes/show', [
            'anime' =>[
                ...$anime,
                'user_anime_id' => $userAnime?->id,
                'registered_status' => $userAnime?->status?->value,
            ],
            'emotionTags' => $emotionTags,
            'attachedEmotionTagIds' => $attachedEmotionTagIds,
            'watchNotes' => $watchNotes,
            'review' => $review,
            'publicReviews' => $publicReviews,
            'keyword' => $request->query('keyword', ''),
        ]);
    }

    public function reviews(
        Request $request,
        int $malId,
        MyAnimeListService $myAnimeListService,
    ): Response {
        $anime = $myAnimeListService->getAnimeByMalId($malId);
        $publicReviews = Review::query()
            ->with([
                'userAnime.user:id,name',
            ])
            ->where('publish', true)
            ->where('is_hidden_by_admin', false)
            ->whereHas(
                'userAnime.animeMaster',
                function ($query) use ($malId) {
                    $query->where('mal_id', $malId);
                },
            )
            ->latest()
            ->paginate(10)
            ->withQueryString();
            $publicReviews->setCollection(
                $publicReviews->getCollection()
                    ->map(function (Review $review) {
                        return [
                            'id' => $review->id,
                            'evaluation' => $review->evaluation,
                            'comment' => $review->comment,
                            'recommend_category' =>
                                $review->recommend_category,
                            'spoiler' => $review->spoiler,
                            'reviewer_name' =>
                                $review->userAnime->user->name,
                            'created_at' =>
                                $review->created_at?->format(
                                    'Y-m-d H:i:s',
                                ),
                        ];
                    }),
            );
        return Inertia::render('animes/reviews/index', [
            'anime' =>[
                'id' => $anime['id'],
                'title' => $anime['title'],
                'user_anime_id' => null,
                'main_picture' => $anime['main_picture'] ?? null,
            ],
            'publicReviews' => $publicReviews,
            'keyword' => $request->query('keyword', ''),
        ]);
    }
}
