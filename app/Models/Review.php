<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'evaluation',
        'comment',
        'recommend_category',
        'publish',
        'spoiler',
        'is_hidden_by_admin',
    ];

    // →取得時の型を明示的に変換する
    public function casts(): array
    {
        return [
            'evaluation' => 'integer',
            'publish' => 'boolean',
            'spoiler' => 'boolean',
            'is_hidden_by_admin' => 'boolean',
        ];
    }

    public function userAnime(): BelongsTo
    {
        return $this->belongsTo(UserAnime::class);
    }
}
