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
        'cover_image',
        'description',
        'genre',
        'source',
        'num_episodes',
        'broadcast_year',
    ];

    public function userAnimes(): HasMany
    {
        return $this->hasMany(UserAnime::class);
    }

}
