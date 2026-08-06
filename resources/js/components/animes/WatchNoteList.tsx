import { router } from '@inertiajs/react';
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
        <div className="mt-4">
            <WatchNoteDialog
                userAnimeId={userAnimeId}
                emotionTags={emotionTags}
                attachedEmotionTagsIds={attachedEmotionTagsIds}
            />
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
                        className="rounded-xl border p-5"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <p className="text-sm font-medium">
                                {watchNote.episode !== null &&
                                watchNote.episode !== undefined
                                    ? `第 ${watchNote.episode}話`
                                    : '話数未設定'}
                            </p>
                        <div className="flex shrink-0 items-center gap-3">
                        {watchNote.created_at && (
                            <time className="mt-1 block text-xs text-muted-foreground">
                                {new Date(
                                    watchNote.created_at,
                                ).toLocaleDateString('ja-JP')}
                            </time>
                        )}
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
                                aria-label="視聴メモを削除"
                                title="削除"
                                className="cursor-pointer text-xs text-red-600 transition"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="size-4"
                                    aria-hidden="true"
                                >
                                    <path d="M3 6h18" />
                                    <path d="M8 6V4h8v2" />
                                    <path d="M19 6l-1 14H6L5 6" />
                                    <path d="M10 11v5" />
                                    <path d="M14 11v5" />
                                </svg>
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

