import { Head, Link, usePage } from '@inertiajs/react';

import RegisterAnimeDialog from '@/components/ui/RegisterAnimeDialog';
import UpdateAnimeStatusDialog from '@/components/ui/UpdateAnimeStatusDialog';
import type { Auth } from '@/types';

type WatchingStatus =
    | 'want_to_watch'
    | 'watching'
    | 'completed'
    | 'dropped';

type Anime = {
    id: number;
    title: string;
    main_picture?: {
        medium: string;
        large: string;
    } ;
    start_date?: string;
    synopsis?: string;
    genres?: {
        id: number;
        name: string;
    }[];
    source?: string | null;
    num_episodes?: number | null;
    user_anime_id: number | null;
    registered_status: WatchingStatus | null;
};

type ShowProps = {
    anime: Anime;
};

const sourceLabels: Record<string, string> = {
    'manga': '漫画',
    'light_novel': 'ライトノベル',
    'novel': '小説',
    'original': 'オリジナル',
    'visual_novel': 'ビジュアルノベル',
    'game': 'ゲーム',
    'web_manga': 'web漫画',
    'web_novel': 'web小説',
    'book': '書籍',
    'music': '音楽',
    'card_game': 'カードゲーム',
    'other': 'その他',
};


export default function Show({ anime }: ShowProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title={anime.title} />

           <main className="mx-auto w-full max-w-6xl px-4 py-8">
                <div className="grid gap-8 md:grid-cols-[280px_1fr]">
                    <section>
                        <div className="aspect-[2/3] w-full overflow-hidden rounded-xl bg-muted">
                            {anime.main_picture ? (
                                <img
                                    src={
                                        anime.main_picture.large ??
                                        anime.main_picture.medium
                                    }
                                    alt={anime.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                    'No Image'
                                </div>
                            )}
                        </div>
                    </section>

                    <section>
                        <h1 className="text-3xl font-bold">
                            {anime.title}
                        </h1>
                        <div className="mt-4 max-w-xs">
                            {!auth.user ? (
                                <Link
                                    href="/login"
                                    className="block w-full rounded-md px-4 py-2 text-sm text-center font-medium hover:bg-muted">
                                        +登録する
                                </Link>
                            ) : anime.registered_status &&
                                anime.user_anime_id ? (
                                    <UpdateAnimeStatusDialog
                                        userAnimeId={anime.user_anime_id}
                                        currentStatus={anime.registered_status}
                                    />
                                ) : (
                                    <RegisterAnimeDialog anime={anime} />
                            )}
                        </div>
                        <div className="mt-4 space-y-3">
                            <p className="text-sm text-muted-foreground">
                                {anime.start_date ?? '放送年未定'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                原作：{anime.source
                                    ? (sourceLabels[anime.source] ?? anime.source)
                                    : '情報なし'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                総話数：{anime.num_episodes !== null && anime.num_episodes !== undefined
                                    ? `${anime.num_episodes}話`
                                    : '情報なし'}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {anime.genres && anime.genres.length > 0 ?(
                                    anime.genres.map((genre) => (
                                    <span
                                        key={genre.id}
                                        className="rounded-full bg-muted px-3 py-1 text-sm"
                                        >
                                        {genre.name}
                                    </span>
                                    ))
                                ) : (
                                    <span className="text-sm text-muted-foreground">
                                        ジャンル情報なし
                                    </span>
                                )}
                            </div>
                        </div>

                            <div className="mt-8">
                                <h2 className="text-2xl font-bold">
                                    あらすじ
                                </h2>
                                <p className="mt-3 whitespace-pre-line leading-7 text-muted-foreground">
                                    {anime.synopsis ?? 'あらすじ未定'}
                                </p>
                            </div>
                    </section>
                </div>
            </main>
        </>
    );
}
