<?php

namespace App\Models;

use App\Enums\WatchingStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;


class UserAnime extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'anime_master_id',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => WatchingStatus::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function animeMaster(): BelongsTo
    {
        return $this->belongsTo(AnimeMaster::class);
    }

    public function watchNotes(): HasMany
    {
        return $this->hasMany(WatchNote::class);
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
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
            'user_anime_id',
            'emotion_tag_id'
        )->withTimestamps();
    }

}
