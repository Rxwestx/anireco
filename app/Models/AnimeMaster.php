<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AnimeMaster extends Model
{
    use HasFactory;

    protected $fillable = [
        'mal_id',
        'title',
        'title_en',
        'title_romaji',
        'cover_image',
        'description',
        'genre',
        'source',
        'num_episodes',
        'broadcast_year',
        'mal_rank',
        'mal_synced_at',
    ];

    protected $casts = [
        'mal_synced_at' => 'datetime',
    ];

    public function userAnimes(): HasMany
    {
        return $this->hasMany(UserAnime::class);
    }

}
