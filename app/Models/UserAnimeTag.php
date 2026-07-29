<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserAnimeTag extends Model
{
    protected $fillable = [
        'user_anime_id',
        'emotion_tag_id',
    ];
    public function userAnime(): BelongsTo
    {
        return $this->belongsTo(UserAnime::class);
    }

    public function emotionTag(): BelongsTo
    {
        return $this->belongsTo(EmotionTag::class);

    }

    public function userAnimeTags(): HasMany
    {
        return $this->hasMany(UserAnimeTag::class);
    }

    public function emotionTags(): BelongsToMany
    {
        return $this->belongsToMany(
            EmotionTag::class,
            'user_anime_tags',
            'user_anime_tag_id',
            'emotion_tag_id'
        )->withTimestamps();
    }
}
