<?php

namespace App\Console\Commands;

use App\Models\AnimeMaster;
use App\Services\MyAnimeListService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:sync-anime-masters-from-mal {--pages=1 : Number of ranking pages to sync} {--offset=0 : Ranking offset to start from}')]
#[Description('Sync anime masters from MyAnimeList')]
class SyncAnimeMastersFromMal extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(MyAnimeListService $myAnimeListService): int
    {
        $pages = (int)$this->option('pages');
        $startOffset = (int) $this->option('offset');

        if ($pages < 1) {
            $this->error('--pages は1以上を指定してください。');

            return self::FAILURE;
        }

        if ($startOffset < 0) {
            $this->error('--offset は0以上を指定してください。');

            return self::FAILURE;
        }

        $totalSynced = 0;

        for ($page = 0; $page < $pages; $page++) {
            $offset = $startOffset + ($page * 100);

            $animeList = $myAnimeListService->getAnimeRanking(
                limit: 100,
                offset: $offset,
            );

            if ($animeList === []) {
                break;
            }

            foreach ($animeList as $anime) {
                AnimeMaster::updateOrCreate(
                    [
                        'mal_id' => $anime['id'],
                    ],
                    [
                        'title' => $anime['title'],
                        'title_en' => $anime['title_en'],
                        'title_romaji' => $anime['title_romaji'],
                        'cover_image' => $anime['main_picture']['large']
                            ?? $anime['main_picture']['medium']
                            ?? null,
                        'genre' => collect($anime['genres'])
                            ->pluck('name')
                            ->implode('、'),
                        'broadcast_year' => $anime['start_date']
                            ? (int)substr($anime['start_date'], 0, 4)
                            : null,
                        'mal_rank' => $anime['mal_rank'],
                        'mal_synced_at' => now()->utc(),
                    ],
                );
            }
            $totalSynced += count($animeList);

            $this->info(
                'ページ' . ($page + 1)
                . ':' .count($animeList)
                . '件同期しました。'
            );
        }
        $this->info(
            '同期完了:合計' . $totalSynced . '件'
        );

        return self::SUCCESS;
    }
}
