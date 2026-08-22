<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\UserAnime;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ReviewController extends Controller
{
    public function store(
        Request $request,
        UserAnime $userAnime
        ): RedirectResponse {
            abort_unless(
                $userAnime->user_id === $request->user()->id,
                403,
                'このレビューを登録する権限がありません。',
            );

            abort_unless(
                $userAnime->status->value === 'completed',
                403,
                '視聴済み作品だけレビューを登録できます。',
            );
            if ($userAnime->review()->exists()) {
                return back()->withErrors([
                    'review' =>'この作品にはすでにレビューが登録されています。',
                ]);
            }

            $validated = $request->validate([
                'evaluation' => [
                    'nullable',
                    'integer',
                    'between:1,5',
                ],
                'comment' => [
                    'nullable',
                    'string',
                ],
                'recommend_category' => [
                    'nullable',
                    'string',
                    Rule::in([
                        '泣きたい時に泣ける',
                        '熱くなりたい時に熱くなれる',
                        'ほっこり癒される',
                        '感慨深い',
                        '笑える',
                        '一気見推奨',
                    ]),
                ],
                'publish' => [
                    'required',
                    'boolean',
                    ],
                'spoiler' => [
                    'required',
                    'boolean',
                ],
            ]);

            $userAnime->review()->create([
                'evaluation' => $validated['evaluation'] ?? null,
                'comment' => $validated['comment'] ?? null,
                'recommend_category' =>
                    $validated['recommend_category'] ?? null,
                'publish' => $validated['publish'],
                'spoiler' => $validated['spoiler'],
            ]);

            return back()->with(
                'success',
                'レビューを登録しました。',
            );
    }

    public function update(
        Request $request,
        UserAnime $userAnime,
        Review $review
    ): RedirectResponse {
        abort_unless(
            $userAnime->user_id === $request->user()->id,
            403,
            'このレビューを編集する権限がありません。',
        );

        abort_unless(
            $review->user_anime_id === $userAnime->id,
            404,
        );

        abort_unless(
            $userAnime->status->value === 'completed',
            403,
            '視聴済み作品だけレビューを更新できます。',
        );

        if (
            $review->is_hidden_by_admin &&
            $request->boolean('publish')
            ){
                return back()->withErrors([
                    'publish' =>
                    '管理者によって非表示されたレビューは、公開に戻すことはできません。',
                ]);
        }

        $validated = $request->validate([
            'evaluation' => [
                'nullable',
                'integer',
                'between:1,5',
            ],
            'comment' => [
                'nullable',
                'string',
                'max:1500',
            ],
            'recommend_category' => [
                'nullable',
                'string',
                Rule::in([
                    '泣きたい時に泣ける',
                    '熱くなりたい時に熱くなれる',
                    'ほっこり癒される',
                    '感慨深い',
                    '笑える',
                    '一気見推奨',
                ]),
            ],
            'publish' => [
                'required',
                'boolean',
                ],
            'spoiler' => [
                'required',
                'boolean',
            ],
        ]);

        $review->update([
            'evaluation' => $validated['evaluation'] ?? null,
            'comment' => $validated['comment'] ?? null,
            'recommend_category' =>
                $validated['recommend_category'] ?? null,
            'publish' => $validated['publish'],
            'spoiler' => $validated['spoiler'],
        ]);

        return back()->with(
            'success',
            'レビューを更新しました。',
        );
    }

    public function destroy(
        Request $request,
        UserAnime $userAnime,
        Review $review
    ): RedirectResponse {
        abort_unless(
            $userAnime->user_id === $request->user()->id,
            403,
            'このレビューを削除する権限がありません。',
        );

        abort_unless(
            $review->user_anime_id === $userAnime->id,
            404,
        );

        $review->delete();

        return back()->with(
            'success',
            'レビューを削除しました。',
        );
    }
}
