import { router } from "@inertiajs/react";
import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export type AdminReview ={
    id: number;
    evaluation: number | null;
    comment: string | null;
    recommend_category: string | null;
    publish: boolean;
    spoiler: boolean;
    is_hidden_by_admin: boolean;
    reviewer_name: string;
    anime: {
        mal_id: number;
        title: string;
    };
    created_at: string | null;
};

type AdminReviewDetailDialogProps = {
    review: AdminReview;
};

export default function AdminReviewDetailDialog({
    review,
}: AdminReviewDetailDialogProps) {
    const [open, setOpen] = useState(false);

    const isPublic =
        review.publish && !review.is_hidden_by_admin;

    const handleHideReview = () => {
        router.patch(
            `/admin/reviews/${review.id}/hide`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setOpen(false);
                },
            },
        );
    };

    const handleRestoreReview = () => {
        router.patch(
            `/admin/reviews/${review.id}/restore`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setOpen(false);
                },
            },
        );
    };

return (
    <Dialog open={open} onOpenChange={setOpen}>
        <button
            type="button"
            onClick={() => setOpen(true)}
            className="cursor-pointer text-sm text-blue-600 hover:underline"
        >
            詳細
        </button>

        <DialogContent className="w-[520px] max-w-[520px] p-0">
            <DialogHeader className="border-b px-6 py-5">
                <DialogTitle className="text-xl">
                    レビュー詳細
                </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 px-6 py-5">
                <div>
                    <p className="mb-2 text-sm font-semibold">
                        投稿者名
                    </p>
                    <div className="min-h-10 rounded border px-3 py-2 text-sm">
                        {review.reviewer_name}
                    </div>
                </div>

                <div>
                    <p className="mb-2 text-sm font-semibold">
                        レビュー内容
                    </p>

                    <div className="min-h-24 rounded border px-3 py-2 text-sm leading-6 whitespace-pre-wrap">
                        {review.comment ?? 'レビュー内容はありません。'}
                    </div>
                </div>

                <div>
                    <p className="mb-2 text-sm font-semibold">
                        おすすめカテゴリ
                    </p>
                    <div className="min-h-10 rounded border px-3 py-2 text-sm">
                        {review.recommend_category ??
                        '設定されていません。'}
                    </div>
                </div>

                <div>
                    <p className="mb-2 text-sm font-semibold">
                        総合評価
                    </p>
                    <div className="min-h-10 rounded border px-3 py-2 text-sm">
                        {review.evaluation !== null
                            ? `${review.evaluation} / 5`
                            : '評価なし'}
                    </div>
                </div>

                <div className="flex gap-10">
                    <div className="flex-1">
                        <p className="mb-2 text-sm font-semibold">
                            投稿日
                        </p>

                        <div className="min-h-10 rounded border px-3 py-2 text-sm">
                            {review.created_at
                                ? new Date(
                                    review.created_at,
                                ).toLocaleDateString(
                                    'ja-JP',
                                )
                                : '投稿日不明'}
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="mb-2 text-sm font-semibold">
                            公開状態
                        </p>
                        <div className="min-h-10 rounded border px-3 py-2 text-sm">
                            {isPublic
                            ?'公開'
                            : '非公開'}
                        </div>
                    </div>
                </div>

                <div>
                    <p className="mb-2 text-sm font-semibold">
                        ネタバレの有無
                    </p>
                    <div className="min-h-10 rounded border px-3 py-2 text-sm">
                        {review.spoiler
                            ? 'ネタバレあり'
                            : 'ネタバレなし'}
                    </div>
                </div>

                <p className="text-xs text-muted-foreground">
                    ※管理者が非公開にしたレビューは、投稿者が公開状態に戻すことはできません。
                </p>
            </div>

            <DialogFooter className="border-t bg-muted/40 px-6 py-4">
                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="cursor-pointer rounded border px-6 py-2 text-sm font-semibold"
                >
                    キャンセル
                </button>

                {!review.is_hidden_by_admin ? (
                    <button
                        type="button"
                        onClick={handleRestoreReview}
                        className="cursor-pointer rounded bg-foreground px-6 py-2 text-sm font-semibold text-background"
                    >
                        公開状態に戻す
                    </button>
                ): (
                    <button
                        type="button"
                        onClick={handleHideReview}
                        className="cursor-pointer rounded bg-foreground px-6 py-2 text-sm font-semibold text-background"
                    >
                        公開にする
                    </button>
                )}
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}
