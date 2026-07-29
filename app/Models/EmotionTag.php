<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EmotionTag extends Model
{

    protected $fillable = [
        'user_id',
        'name',
    ];
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function userAnimeTags(): HasMany
    {
        return $this->hasMany(UserAnimeTag::class);
    }

    public function userAnimes(): BelongsToMany
    {
        return $this->belongsToMany(
            UserAnime::class,
            'user_anime_tags',
            'emotion_tag_id',
            'user_anime_id'
        )->withTimestamps();
    }
}
