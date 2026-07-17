<?php

namespace App\Enums;

enum WatchingStatus: string
{
    case WantToWatch = 'want_to_watch';
    case Watching = 'watching';
    case Completed = 'completed';
    case Dropped = 'dropped';
    
    public function label(): string
    {
        return match ($this) {
            self::WantToWatch => '見たい',
            self::Watching => '視聴中',
            self::Completed => '視聴済み',
            self::Dropped => '断念',
        };
    }
}
