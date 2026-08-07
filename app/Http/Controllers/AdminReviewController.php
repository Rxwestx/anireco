<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminReviewController extends Controller
{
    // 管理者用のレビュー一覧画面
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'visibility' => [
                'nullable',
                Rule::in([
                    'all',
                    'public',
                    'hidden',
                ]),
            ],
        ]);

        $visibility = $validated['visibility'] ?? 'all';

        $reviewsQuery = Review::query()
            ->with([
                'userAnime.user:id,name',
                'userAnime.animeMaster:id,title,mal_id',
            ])
                ->where(function ($query) {
                $query
                    ->where('publish', true)
                    ->orWhere('is_hidden_by_admin', true);
            });

            if ($visibility === 'public') {
                $reviewsQuery
                    ->where('publish', true)
                    ->where('is_hidden_by_admin', false);
            } elseif ($visibility === 'hidden') {
                $reviewsQuery
                ->where('is_hidden_by_admin', true);
            }

        $reviews = $reviewsQuery
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Review $review):array => [
                'id' => $review->id,
                'evaluation' => $review->evaluation,
                'comment' => $review->comment,
                'recommend_category' => $review->recommend_category,
                'publish' => $review->publish,
                'spoiler' => $review->spoiler,
                'is_hidden_by_admin' => $review->is_hidden_by_admin,
                'reviewer_name' => $review->userAnime->user->name,
                'anime' => [
                    'mal_id' => $review->userAnime->animeMaster->mal_id,
                    'title' => $review->userAnime->animeMaster->title,
                ],
                'created_at' => $review->created_at->format('Y-m-d H:i:s'),
            ]);

        return Inertia::render('admin/reviews/index', [
            'reviews' => $reviews,
            'selectedVisibility' => $visibility,
        ]);

    }

    // 管理者用のレビュー非表示処理
    public function hide(Review $review): RedirectResponse
    {

        $review->update([
            'publish'=> false,
            'is_hidden_by_admin' => true,
        ]);

        return back()->with(
            'success',
            'レビューを非表示にしました。',
        );
    }

    //管理者によるレビューの非表示解除処理
    public function restore(Review $review): RedirectResponse
    {
        $review->update([
            'publish'=> true,
            'is_hidden_by_admin' => false,
        ]);

        return back()->with(
            'success',
            'レビューを公開状態に戻しました。',
        );
    }
}
