import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

const recommendCategories = [
    '泣きたい時に泣ける',
    '熱くなりたい時に熱くなれる',
    'ほっこり癒される',
    '感慨深い',
    '笑える',
    '一気見推奨',
] as const;

type  CreateReviewDialogProps = {
    userAnimeId: number;
    triggerClassName?: string;
};

export default function CreateReviewDialog({
    userAnimeId,
    triggerClassName,
}: CreateReviewDialogProps) {
    const [open, setOpen] = useState(false);

    const form = useForm({
        evaluation: '',
        comment: '',
        recommend_category: '',
        publish: false,
        spoiler: false,
    });

    const handleOpen = () => {
        form.reset();
        form.clearErrors();
        setOpen(true);
    };

    const handleClose = () => {
        if (form.processing) {
            return;
        }
        setOpen(false);
        form.reset();
        form.clearErrors();
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        form.post(
            `/user-animes/${userAnimeId}/reviews`,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setOpen(false);
                    form.reset();
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
                className={
                    triggerClassName ??
                    "cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/70"
                }
            >
                レビューを書く
            </button>

            <DialogContent className="sm:max-w-xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            レビューを書く
                            </DialogTitle>
                    </DialogHeader>

                    <div className="mt-6 space-y-6">
                        <div>
                            <p className="mb-2 block text-sm font-medium">
                                総合評価（任意）
                            </p>

                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((value) => {
                                    const selectedEvaluation = Number(form.data.evaluation,
                                );
                            return (
                                        <button
                                            key={value}
                                            type="button"
                                            aria-label={`${value}点`}
                                            title={`${value}点`}
                                            onClick={() =>
                                                form.setData(
                                                    'evaluation',
                                                    String(value),
                                                )
                                            }
                                            className="cursor-pointer text-3xl leading-none"
                                        >

                                            <span
                                                className={
                                                    value <= selectedEvaluation
                                                        ? 'text-yellow-500'
                                                        : 'text-muted-foreground/40'
                                                }
                                            >
                                                ★
                                            </span>
                                        </button>
                                    );
                                })}
                            {form.data.evaluation && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        form.setData('evaluation', '')
                                    }
                                    className="ml-3 cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                                >
                                    評価を解除
                                </button>
                            )}
                            </div>

                            {form.data.evaluation && (
                                <p className="mt-3 text-sm text-muted-foreground">
                                    {form.data.evaluation} / 5
                                </p>
                            )}
                            {form.errors.evaluation && (
                                <p className="mt-1 text-sm text-red-600">
                                    {form.errors.evaluation}
                                </p>
                            )}
                        </div>


                        <div>
                            <label
                                htmlFor="review-comment"
                                className="mb-2 block text-sm font-medium"
                            >
                                おすすめ理由・レビュー（任意）
                            </label>

                            <textarea
                                id="review-comment"
                                value={form.data.comment}
                                onChange={(e) =>
                                    form.setData(
                                        'comment',
                                        e.target.value,
                                    )
                                }
                                rows={6}
                                placeholder="この作品をおすすめしたい理由やアニメ作品全体の感想を書いて下さい。"
                                className="w-full resize-y rounded-md border bg-background px-3 py-2 text-sm"
                            />

                            {form.errors.comment && (
                                <p className="mt-1 text-sm text-red-600">
                                    {form.errors.comment}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="review-recommend-category"
                                className="mb-2 block text-sm font-medium"
                            >
                                おすすめカテゴリー（任意）
                            </label>

                            <select
                                id="review-recommend-category"
                                value={form.data.recommend_category}
                                onChange={(e) =>
                                    form.setData(
                                        'recommend_category',
                                        e.target.value,
                                    )
                                }
                                className="w-full cursor-pointer rounded-md border bg-background px-3 py-2 text-sm"
                            >
                                <option value="">
                                    カテゴリーを選択して下さい
                                </option>

                                {recommendCategories.map((category) => (
                                    <option
                                        key={category}
                                        value={category}
                                    >
                                        {category}
                                    </option>
                                ))}
                            </select>

                            {form.errors.recommend_category && (
                                <p className="mt-1 text-sm text-red-600">
                                    {form.errors.recommend_category}
                                </p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="flex cursor-pointer items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={form.data.publish}
                                    onChange={(e) =>
                                        form.setData(
                                            'publish',
                                            e.target.checked,
                                        )
                                    }
                                    className="h-4 w-4"
                                />
                                <span className="text-sm">
                                    このレビューを公開する
                                </span>
                            </label>

                            {form.errors.publish && (
                                <p className="mt-1 text-sm text-red-600">
                                    {form.errors.publish}
                                </p>
                            )}

                            <label className="flex cursor-pointer items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={form.data.spoiler}
                                    onChange={(e) =>
                                        form.setData(
                                            'spoiler',
                                            e.target.checked,
                                        )
                                    }
                                    className="h-4 w-4"
                                />
                                <span className="text-sm">
                                    このレビューにはネタバレが含まれます
                                </span>
                            </label>

                            {form.errors.spoiler && (
                                <p className="mt-1 text-sm text-red-600">
                                    {form.errors.spoiler}
                                </p>
                            )}
                        </div>

                        {form.errors.review && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.review}
                            </p>
                        )}
                    </div>

                    <DialogFooter className="mt-6">
                        <button
                            type="button"
                            onClick={handleClose}
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
                                ? '投稿中...'
                                : '投稿する'}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
