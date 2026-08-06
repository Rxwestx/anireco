import { useForm }from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type EditWatchNoteDialogProps = {
    userAnimeId: number;
    watchNote:{
        id: number;
        episode?: number | null;
        content: string;
    };
};

export default function EditWatchNoteDialog({
    userAnimeId,
    watchNote,
}: EditWatchNoteDialogProps) {
    const [open, setOpen] = useState(false);

    const form = useForm({
        episode:
            watchNote.episode !== null &&
            watchNote.episode !== undefined
                ? String(watchNote.episode)
                : '',
        content: watchNote.content,
    });

    const handleOpen =() => {
        form.setData({
            episode:
                watchNote.episode !== null &&
                watchNote.episode !== undefined
                    ? String(watchNote.episode)
                    : '',
            content: watchNote.content,
        });
        form.clearErrors();
        setOpen(true);
    };

    const handleClose = () => {
        if(form.processing) {
            return;
        }
        setOpen(false);
        form.clearErrors();
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        form.patch(
            `/user-animes/${userAnimeId}/watch-notes/${watchNote.id}`,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setOpen(false);
                    form.clearErrors();
                },
            }
        );
    };

    return (
        <Dialog
             open={open}
             onOpenChange={(nextOpen) => {
                 if (nextOpen) {
                     handleOpen();
                     return;
                 }

                    handleClose();
             }}
        >
            <button
                type="button"
                onClick={handleOpen}
                aria-label="視聴メモの編集"
                title="編集"
                className="cursor-pointer text-xs text-muted-foreground transition hover:text-foreground"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4"
                    aria-hidden="true"
                >
                    <path d="M12 20h9" />
                    <path
                        d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"
                    />
                </svg>
            </button>

            <DialogContent className="sm:max-w-xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            視聴メモの編集
                        </DialogTitle>
                    </DialogHeader>

                <div className="mt-6 space-y-6">
                    <div>
                        <label
                            htmlFor={`episode-${watchNote.id}`}
                            className="mb-2 block text-sm font-medium"
                        >
                            エピソード(任意)
                        </label>

                        <input
                            id={`episode-${watchNote.id}`}
                            type="number"
                            min="1"
                            value={form.data.episode}
                            onChange={(e) =>
                                form.setData(
                                    "episode",
                                     e.target.value,
                                )
                            }
                            placeholder="例：1"
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                        />

                        {form.errors.episode && (
                            <p className="mt-1 text-xs text-red-600">
                                {form.errors.episode}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor={`content-${watchNote.id}`}
                            className="mb-2 block text-sm font-medium"
                        >
                            メモ
                            <span className="ml-1 text-red-600">
                                *
                            </span>
                        </label>
                        <textarea
                            id={`content-${watchNote.id}`}
                            value={form.data.content}
                            onChange={(e) =>
                                form.setData(
                                    "content",
                                    e.target.value,
                                )
                            }
                            onKeyDown={(e) => {
                                if (
                                    (e.metaKey || e.ctrlKey) && e.key === "Enter"
                                ) {
                                    e.preventDefault();
                                    e.currentTarget.form?.requestSubmit();
                                }
                            }}
                            maxLength={500}
                            rows={6}
                            placeholder="視聴した感想や気づきなどを自由にメモしましょう。"
                            className="w-full resize-y rounded-md border bg-background px-3 py-2 text-sm"
                        />
                        <div className="mt-1 flex items-start justify-between gap-4">
                            <div>
                                {form.errors.content && (
                                    <p className="text-xs text-red-600">
                                        {form.errors.content}
                                    </p>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {form.data.content.length}/500
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-6">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={form.processing}
                        className="cursor-pointer rounded-md border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        キャンセル
                    </button>

                    <button
                        type="submit"
                        disabled={form.processing}
                        className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {form.processing
                            ? "更新中..."
                            : "更新"}
                    </button>
                </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
