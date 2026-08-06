<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminReviewController extends Controller
{
    // 管理者用のレビュー一覧画面
    public function index(): Response
    {
        $reviews = Review::query()
            ->with([
                'userAnime.user:id,name',
                'userAnime.animeMaster:id,title,mal_id',
            ])
            ->where('publish', true)
            ->paginate(10)
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
        ]);

    }

    // 管理者用のレビュー非表示処理
    public function hide(Review $review): RedirectResponse
    {

        $review->update([
            'is_hidden_by_admin' => true,
        ]);

        return back()->with(
            'success',
            'レビューを非表示にしました。',
        );
    }

}
