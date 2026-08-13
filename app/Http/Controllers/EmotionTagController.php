<?php

namespace App\Http\Controllers;

use App\Models\EmotionTag;
use Illuminate\Http\RedirectResponse;
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

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate(
            [
                'name' => [
                    'required',
                    'string',
                    'max:50',
                ],
            ],
            [
                'name.required' => 'タグ名を入力してください。',
                'name.string' => 'タグ名は文字列で入力してください。',
                'name.max' => 'タグ名は50文字以内で入力してください。',
            ]
        );

        $alreadyExists = $request->user()
            ->emotionTags()
            ->where('name', $validated['name'])
            ->exists();

        if ($alreadyExists) {
            return back()->withErrors([
                'name' => '同じ名前の感情タグはすでに登録されています。',
            ]);
        }

        $request->user()
            ->emotionTags()
            ->create([
                'name' => $validated['name'],
            ]);

        return back()->with(
            'success',
            '感情タグを登録しました。',
        );
    }

    public function update(
        Request $request,
        EmotionTag $emotionTag
    ): RedirectResponse {
        abort_unless(
            $emotionTag->user_id === $request->user()->id,
            403
        );

        $validated = $request->validate(
            [
                'name' => [
                    'required',
                    'string',
                    'max:50',
                ],
            ],
                [
                    'name.required' => 'タグ名を入力してください。',
                    'name.string' => 'タグ名は文字列で入力してください。',
                    'name.max' => 'タグ名は50文字以内で入力してください。',
                ],
        );

        $alreadyExists = $request->user()
            ->emotionTags()
            ->where('name', $validated['name'])
            ->whereKeyNot($emotionTag->id)
            ->exists();

        if ($alreadyExists) {
            return back()->withErrors([
                'name' => '同じ名前の感情タグはすでに登録されています。',
            ]);
        }

        $emotionTag->update([
            'name' => $validated['name'],
        ]);

        return back()->with(
            'success',
            '感情タグを更新しました。',
        );
    }

    public function destroy(
        Request $request,
        EmotionTag $emotionTag
    ): RedirectResponse {
        abort_unless(
            $emotionTag->user_id === $request->user()->id,
            403
        );

        $emotionTag->delete();

        return back()->with(
            'success',
            '感情タグを削除しました。',
        );
    }
}
