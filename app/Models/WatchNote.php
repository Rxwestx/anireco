<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WatchNote extends Model
{
    protected $fillable = [
        'user_anime_id',
        'episode',
        'content',
    ];
    public function userAnime(): BelongsTo
    {
        return $this->belongsTo(UserAnime::class);
    }
}
