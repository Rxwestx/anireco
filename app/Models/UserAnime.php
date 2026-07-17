<?php

namespace App\Models;

use App\Enums\WatchingStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


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
}
