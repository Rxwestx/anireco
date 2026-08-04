import { Head, Link, router } from '@inertiajs/react';
import EditWatchNoteDialog from '@/components/ui/EditWatchNoteDialog';
import Pagination from '@/components/ui/Pagination';

type Anime = {
    id: number;
    mal_id: number;
    title: string;
    cover_image: string | null;
    user_anime_id: number;
};

type WatchNote = {
    id: number;
    episode: number | null;
    content: string;
    created_at: string | null;
    updated_at: string | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedWatchNotes = {
    data: WatchNote[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
};

type WatchNotesIndexProps = {
    anime: Anime;
    watchNotes: PaginatedWatchNotes;
};

export default function WatchNotesIndex({
    anime,
    watchNotes,
}: WatchNotesIndexProps) {
    const handleDeleteWatchNote = (watchNoteId: number) => {
        const shouldDelete = window.confirm(
            'この視聴メモを削除してもよろしいですか？'
        );

        if (!shouldDelete) {
            return;
        }

        router.delete(
            `/user-animes/${anime.user_anime_id}/watch-notes/${watchNoteId}`,
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <>
            <Head title={`${anime.title} - 視聴メモ`} />

            <main className="mx-auto w-full max-w-4xl px-4 py-8">
                <Link
                    href={`/animes/${anime.mal_id}`}
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    ◀︎ アニメ作品詳細に戻る
                </Link>

                <header className="mt-6 flex items-start gap-4">
                    {anime.cover_image && (
                        <img
                            src={anime.cover_image}
                            alt={anime.title}
                            className="h-32 w-24 rounded-md object-cover"
                        />
                    )}

                    <div>
                        <h1 className="text-2xl font-bold">
                            {anime.title}
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            視聴メモ一覧
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            全{watchNotes.total}件
                        </p>
                    </div>
                </header>


                {watchNotes.data.length === 0 ? (
                    <section className="mt-8 rounded-xl border p-6">
                        <p className="text-sm text-muted-foreground">
                            視聴メモはまだありません。
                        </p>
                    </section>
                ) : (
                    <section className="mt-8 space-y-4">
                        {watchNotes.data.map((watchNote) => (
                            <article
                                key={watchNote.id}
                                className="rounded-xl border p-6"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-medium">
                                            {watchNote.episode !== null
                                                ? `第 ${watchNote.episode}話`
                                                : '話数未設定'}
                                        </p>
                                        {watchNote.created_at && (
                                            <time className="mt-1 block text-xs text-muted-foreground">
                                                {new Date(
                                                    watchNote.created_at,
                                                ).toLocaleDateString(
                                                    'ja-JP')}
                                            </time>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <EditWatchNoteDialog
                                            userAnimeId={
                                                anime.user_anime_id
                                            }
                                            watchNote={{
                                                id: watchNote.id,
                                                episode: watchNote.episode,
                                                content: watchNote.content,
                                            }}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteWatchNote(
                                                    watchNote.id
                                                )
                                            }
                                            className="cursor-pointer text-sm text-red-600 hover:underline"
                                        >
                                            削除
                                        </button>
                                    </div>
                                </div>

                                <p className="mt-4 leading-6 whitespace-pre-wrap text-muted-foreground">
                                    {watchNote.content}
                                </p>
                            </article>
                        ))}
                    </section>
                )}
                <Pagination
                    links={watchNotes.links}
                    lastPage={watchNotes.last_page}
                    ariaLabel="視聴メモのページ移動"
                />
            </main>
        </>
    );
}
