import { Link, router } from '@inertiajs/react';
import EditWatchNoteDialog from '@/components/ui/EditWatchNoteDialog';
import WatchNoteDialog from '@/components/ui/WatchNoteDialog';

type EmotionTag ={
    id: number;
    name:string;
};

type WatchNote = {
    id: number;
    episode?: number | null;
    content: string;
    created_at: string | null;
};

type WatchNoteListProps = {
    userAnimeId:number;
    watchNotes: WatchNote[];
    emotionTags: EmotionTag[];
    attachedEmotionTagsIds: number[];
};


export default function WatchNoteList({
    userAnimeId,
    watchNotes,
    emotionTags,
    attachedEmotionTagsIds,
}: WatchNoteListProps) {
    const handleDeleteWatchNote = (watchNoteId: number) => {
        const shouldDelete = window.confirm(
            'この視聴メモを削除してもよろしいですか？'
        );

        if (!shouldDelete) {
            return;
        }

        router.delete(
            `/user-animes/${userAnimeId}/watch-notes/${watchNoteId}`,
            {
                preserveScroll: true,
            },
        );
    };

  return (
    <>
        <div className="mt-4 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <WatchNoteDialog
                userAnimeId={userAnimeId}
                emotionTags={emotionTags}
                attachedEmotionTagsIds={attachedEmotionTagsIds}
            />
            {watchNotes.length > 0 && (
                <Link
                    href={`/user-animes/${userAnimeId}/watch-notes`}
                    className="text-sm text-muted-foreground transition hover:text-foreground hover:underline"
                >
                    すべての視聴メモを見る
                </Link>
            )}
        </div>

        {watchNotes.length === 0 ? (
            <div className="mt-4 rounded-xl border p-6">
                <p className="text-sm text-muted-foreground">
                    視聴メモはまだありません。
                </p>
            </div>
        ) : (
            <div className="mt-4 space-y-4">
                {watchNotes.map((watchNote) => (
                    <article
                        key={watchNote.id}
                        className="rounded-xl border p-4 sm:p-5"
                    >
                    <div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ">
                            <p className="text-sm font-medium">
                                {watchNote.episode !== null &&
                                watchNote.episode !== undefined
                                    ? `第 ${watchNote.episode}話`
                                    : '話数未設定'}
                            </p>
                        {watchNote.created_at && (
                            <time className="mt-1 block text-xs text-muted-foreground">
                                {new Date(
                                    watchNote.created_at,
                                ).toLocaleDateString('ja-JP')}
                            </time>
                        )}
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto">
                            <EditWatchNoteDialog
                                userAnimeId={userAnimeId}
                                watchNote={watchNote}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    handleDeleteWatchNote(
                                        watchNote.id,
                                    )
                                }
                                className="cursor-pointer text-xs text-red-600 hover:underline"
                            >
                                削除
                            </button>
                        </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 whitespace-pre-wrap">
                        {watchNote.content}
                    </p>
                    </article>
                ))}
            </div>
        )}
    </>
  );
}

