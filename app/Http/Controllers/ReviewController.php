<?php

namespace App\Http\Controllers;

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
                403,  'You are not authorized to update this review.'
            );

            abort_unless(
                $userAnime->status->value === 'completed',
                403,
                '視聴済み作品だけレビューを登録できます。',
            );

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
}
