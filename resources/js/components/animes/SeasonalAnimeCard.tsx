import { Link, usePage } from "@inertiajs/react"
import RegisterAnimeDialog from "@/components/ui/RegisterAnimeDialog";
import UpdateAnimeStatusDialog from "@/components/ui/UpdateAnimeStatusDialog";

export type WatchingStatus =
    | "want_to_watch"
    | "watching"
    | "completed"
    | "dropped";

export type SeasonalAnime = {
    id: number;
    title: string;
    main_picture: {
        medium?: string;
        large?: string;
    } | null;
    start_date: string | null;
    genres: {
        id: number;
        name: string;
    }[];
    mean: number | null;
    status: string | null;
    user_anime_id: number | null;
    registered_status: WatchingStatus | null;
};


type SeasonalAnimeCardProps = {
    anime: SeasonalAnime;
};

export default function SeasonalAnimeCard({
    anime,
}: SeasonalAnimeCardProps) {
    const { auth } = usePage().props;

    const imageUrl =
    anime.main_picture?.large ??
        anime.main_picture?.medium ??
        null;

    const statusLabel = {
        currently_airing: '放送中',
        finished_airing: '放送終了',
        not_yet_aired: '放送前',
    }[anime.status ?? ''];

    return (

    <div className="group flex h-full flex-col overflow-hidden rounded-xl border bg-background transition hover:-translate-y-1 hover:shadow-lg">
        <Link
            href={`/animes/${anime.id}`}>
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={anime.title}
                    className="h-[220px] w-full rounded-md object-cover"
                    />
            ) : (
                <div className="flex h-[220px] items-center justify-center rounded-md bg-muted">
                    <span className="text-sm text-muted-foreground">
                        No Image
                    </span>
                </div>
            )}
            <div className="mt-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                <p
                    className="truncate text-sm font-semibold"
                    title={anime.title}
                >
                    {anime.title}
                </p>

                {anime.status && (
                    <span className="shrink-0 rounded border px-2 py-1 text-xs">
                        {statusLabel}
                    </span>
                )}
                </div>
                <p className="text-sm">
                    評価：
                    {anime.mean !== null
                        ? anime.mean.toFixed(2)
                        : '評価なし'}
                </p>

                <div className="flex flex-wrap gap-1">
                    {anime.genres.slice(0, 3).map((genre) => (
                        <span
                            key={genre.id}
                            className="rounded-full border border-[#e5e5e5] bg-[#f5f5f5] px-2 py-0.5 text-xs text-[#333]"
                        >
                            {genre.name}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
                <div className="mt-auto pt-4">
                {!auth.user ? (
                    <Link
                        href="/login"
                        className="block w-full rounded-md px-4 py-2 text-sm text-center font-medium hover:bg-muted">
                            +登録する
                    </Link>
                ) : anime.registered_status && anime.user_anime_id ? (
                    <UpdateAnimeStatusDialog
                        userAnimeId={anime.user_anime_id}
                        currentStatus={anime.registered_status}
                    />
                ) : (
                    <RegisterAnimeDialog
                        anime={{
                            id: anime.id,
                            title: anime.title,
                        }}
                    />
                )}
                </div>
            </div>
    );
}
