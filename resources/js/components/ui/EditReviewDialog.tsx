import { useForm } from '@inertiajs/react';
import{ useState } from 'react';
import type{ FormEvent } from 'react';

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

 type Review = {
    id: number;
    evaluation: number | null;
    comment: string | null;
    recommend_category: string | null;
    publish: boolean;
    spoiler: boolean;
    is_hidden_by_admin: boolean;
 };

 type EditReviewDialogProps = {
    userAnimeId: number;
    review: Review;
    triggerLabel?: string;
    triggerClassName?: string;
 };

 export default function EditReviewDialog({
    userAnimeId,
    review,
    triggerLabel,
    triggerClassName,
 }: EditReviewDialogProps) {
    const [Open, setOpen] = useState(false);

    const form = useForm({
        evaluation:
            review.evaluation !== null
            ? String(review.evaluation)
            : '',
        comment: review.comment ?? '',
        recommend_category:
            review.recommend_category ?? '',
        publish: review.publish,
        spoiler: review.spoiler,
    });

    const resetToCurrentReview = () => {
        form.setData({
            evaluation:
                review.evaluation !== null
                ? String(review.evaluation)
                : '',
            comment: review.comment ?? '',
            recommend_category:
                review.recommend_category ?? '',
            publish: review.publish,
            spoiler: review.spoiler,
        });

        form.clearErrors();
    };

    const handleOpen = () => {
        resetToCurrentReview();
        setOpen(true);
    };

    const handleClose = () => {
        if (form.processing) {
            return;
        }

        setOpen(false);
        resetToCurrentReview();
    };

    const handleSubmit = (
        e: FormEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();

        form.patch(
            `/user-animes/${userAnimeId}/reviews/${review.id}`,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setOpen(false);
                    form.clearErrors();
                },
            },
        );
    };

    return (
        <Dialog
            open={Open}
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
                aria-label="レビューの編集"
                title="編集"
                className={
                    triggerClassName ??
                    "cursor-pointer text-sm text-muted-foreground transition hover:text-foreground"
                }
            >
                {triggerLabel ??(
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
                )}
            </button>

            <DialogContent className="sm:max-w-xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            レビューを編集
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-6 space-y-6">
                        <div>
                            <p className="mt-2 text-sm font-medium">
                                総合評価（任意）
                            </p>

                            <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(
                                (value) => {
                                    const selectedEvaluation =
                                        Number(
                                            form.data
                                                .evaluation,
                                        );

                                    return (
                                        <button
                                            key={value}
                                            type="button"
                                            aria-label={`${value}点`}
                                            title={`${value}点`}
                                            onClick={() => {
                                                form.setData(
                                                    'evaluation',
                                                    String(
                                                        value,
                                                    ),
                                                )
                                            }}
                                            className="cursor-pointer text-3xl leading-none"
                                        >
                                            <span
                                                className={
                                                    value <=
                                                    selectedEvaluation
                                                        ? 'text-amber-500'
                                                        : 'text-muted-foreground/40'
                                                }
                                            >
                                                ★
                                            </span>
                                        </button>
                                    );
                                },
                            )}

                            {form.data.evaluation && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        form.setData(
                                            'evaluation',
                                            '',
                                        )
                                    }
                                    className="ml-3 cursor-pointer text-xs text-muted-foreground hover:text-foreground"
                                >
                                    評価を解除
                                </button>
                            )}
                            </div>

                            {form.data.evaluation && (
                                <p className="mt-2 text-sm text-muted-foreground">
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
                                htmlFor={`review-comment-${review.id}`}
                                className="mb-2 block text-sm font-medium"
                            >
                                おすすめ理由・レビュー（任意）
                            </label>

                            <textarea
                                id={`review-comment-${review.id}`}
                                value={form.data.comment}
                                onChange={(e) =>
                                    form.setData(
                                        'comment',
                                        e.target.value,
                                    )
                                }
                                rows={6}
                                className="w-full resize-y rounded-md border bg-background px-3 py-2 text-sm"
                            />

                                {form.errors.comment && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {form.errors.comment}
                                    </p>
                                )}
                        </div>

                        <div>
                            <select
                                id={`review-recommend-category-${review.id}`}
                                value={
                                    form.data.recommend_category
                                }
                                onChange={(e) =>
                                    form.setData(
                                        'recommend_category',
                                        e.target.value,
                                    )
                                }
                                className="w-full cursor-pointer rounded-md border bg-background px-3 py-2 text-sm"
                            >
                                <option value="">
                                    おすすめカテゴリ-を選択してください（任意）
                                </option>

                                {recommendCategories.map(
                                    (category) => (
                                        <option
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </option>
                                    ),
                                )}
                            </select>

                            {form.errors.recommend_category && (
                                <p className="mt-1 text-sm text-red-600">
                                    {
                                        form.errors
                                            .recommend_category
                                    }
                                </p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="flex cursor-pointer items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={form.data.publish}
                                    disabled={
                                        review.is_hidden_by_admin
                                    }
                                    onChange={(e) =>
                                        form.setData(
                                            'publish',
                                            e.target.checked,
                                        )
                                    }
                                    className="h-4 w-4 disabled:cursor-not-allowed disabled:opacity-50"
                                />

                                <span className="text-sm">
                                    このレビューを公開する
                                </span>
                            </label>

                            {review.is_hidden_by_admin && (
                                <p className="text-sm text-red-600">
                                    このレビューは管理者によって非公開にされています。公開することはできません。
                                </p>
                            )}

                            {form.errors.publish && (
                                <p className="text-sm text-red-600">
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
                                    このレビューにはネタバレが含まれています
                                </span>
                            </label>

                            {form.errors.spoiler && (
                                <p className="text-sm text-red-600">
                                    {form.errors.spoiler}
                                </p>
                            )}
                        </div>
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
                                ? '更新中...'
                                : '更新する'}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
