import { useForm } from "@inertiajs/react";
import { useState } from "react";
import type { FormEvent } from "react";

import CreateEmotionTagDialog from "@/components/ui/CreateEmotionTagDialog";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type EmotionTag = {
    id: number;
    name: string;
};

type WatchNoteDialogProps = {
    userAnimeId: number;
    emotionTags: EmotionTag[];
    attachedEmotionTagIds: number[];
    triggerClassName?: string;
};


export default function WatchNoteDialog({
    userAnimeId,
    emotionTags,
    attachedEmotionTagIds,
    triggerClassName,
}: WatchNoteDialogProps) {
    const [open, setOpen] = useState(false);

    const form = useForm({
        episode: "",
        content: "",
        emotion_tag_ids:[ ] as number[],
    });

    const handleOpen = () => {
        form.setData({
            episode: "",
            content: "",
            emotion_tag_ids: [...attachedEmotionTagIds],
        });

        form.clearErrors();
        setOpen(true);
    }

    const handleClose = () => {
        if(form.processing) {
            return;
    }

    setOpen(false);
    form.reset();
    form.clearErrors();
    };

    const toggleEmotionTag = (emotionTagId: number) => {
        const isSelected =
        form.data.emotion_tag_ids.includes(emotionTagId);

        form.setData(
            "emotion_tag_ids",
            isSelected
                ? form.data.emotion_tag_ids.filter(
                    (id) => id !== emotionTagId,
                )
                : [
                    ...form.data.emotion_tag_ids,
                    emotionTagId,
                ],
        );
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        form.post(`/user-animes/${userAnimeId}/watch-notes`, {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                form.reset();
                form.clearErrors();
            },
        });
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
                className={
                    triggerClassName ??
                    "mt-6 h-10 w-52 cursor-pointer rounded border-foreground text-sm font-semibold hover:bg-muted"}
            >
                + 視聴メモを追加
            </button>

            <DialogContent className="sm:max-w-xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            視聴メモを追加
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-6 space-y-6">
                        <div>
                            <label
                            htmlFor="episode"
                            className="mb-2 block text-sm font-medium">
                                エピソード (任意)
                            </label>

                            <input
                                id="episode"
                                type="number"
                                min="1"
                                value={form.data.episode}
                                onChange={(e) =>
                                    form.setData(
                                        "episode",
                                        e.target.value
                                    )
                                }
                                placeholder="例: 1"
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                            />
                            {form.errors.episode && (
                                <p className="mt-1 text-sm text-red-600">
                                    {form.errors.episode}
                                </p>
                            )}
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between gap-4">
                                <p className="text-sm font-medium">
                                    感情タグ
                                </p>

                                <span className="text-xs text-muted-foreground">
                                    複数選択可
                                </span>
                            </div>
                            {emotionTags.length === 0 ? (
                                <p className="rounded-md border p-3 text-sm text-muted-foreground">
                                    感情タグが登録されていません。
                                </p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {emotionTags.map((emotionTag) => {
                                        const isSelected =
                                            form.data.emotion_tag_ids.includes(
                                                emotionTag.id,
                                            );

                                        return (
                                            <button
                                                key={emotionTag.id}
                                                type="button"
                                                onClick={() =>
                                                    toggleEmotionTag(emotionTag.id)
                                                }
                                                aria-pressed={isSelected}
                                                className={
                                                    isSelected
                                                        ? "cursor-pointer rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                                                        : "cursor-pointer rounded-md border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
                                                }
                                            >
                                                {emotionTag.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                            <div className="mt-3">
                                    <CreateEmotionTagDialog
                                        buttonLabel="+ 新しい感情タグを作る"
                                        buttonClassName="cursor-pointer text-sm text-muted-foreground hover:text-foreground hover:underline"
                                    />
                            </div>
                            {form.errors.emotion_tag_ids && (
                                <p className="mt-1 text-sm text-red-600">
                                    {form.errors.emotion_tag_ids}
                                </p>
                            )}
                        </div>


                        <div>
                            <label
                                htmlFor="content"
                                className="mb-2 block text-sm font-medium"
                            >
                                メモ
                                <span className="ml-1 text-red-600">
                                    *
                                </span>
                            </label>
                            <textarea
                                id="content"
                                value={form.data.content}
                                onChange={(e) =>
                                    form.setData(
                                        "content",
                                        e.target.value,
                                    )
                                }
                                onKeyDown={(e) => {
                                    if (
                                        (e.metaKey || e.ctrlKey) &&
                                        e.key === "Enter"
                                ) {
                                        e.preventDefault();
                                        e.currentTarget.form?.requestSubmit();
                                    }
                                }}
                                maxLength={500}
                                rows={6}
                                placeholder="視聴中や視聴後の感想をメモとして残すことができます。"
                                className="w-full resize-y rounded-md border bg-background px-3 py-2 text-sm"
                            />
                            <div className="mt-1 flex items-start justify-between gap-4">
                                <div>
                                    {form.errors.content && (
                                        <p className="text-sm text-red-600">
                                            {form.errors.content}
                                        </p>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {form.data.content.length}/500
                                </p>
                            </div>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            ※視聴中・視聴後の感想をメモとして残すことができます。
                        </p>
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
                            {form.processing ? "保存中..." : "保存する"}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
