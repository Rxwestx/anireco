import { Link } from "@inertiajs/react";

type PublicReview = {
    id: number;
    evaluation: number | null;
    comment: string | null;
    recommend_category: string | null;
    spoiler: boolean;
    reviewer_name: string;
    created_at: string | null;
};

type PublicReviewListProps = {
    malId: number;
    publicReviews?: PublicReview[];
};

export default function PublicReviewList({
    malId,
    publicReviews = [],
}: PublicReviewListProps) {
    return (
        <section className="mt-12">
            <div className="border-b pb-3">
                <h2 className="text-xl font-semibold">
                    みんなのレビュー
                </h2>
            </div>

            {publicReviews.length === 0 ? (
                <div className="mt-4 rounded-xl border p-6">
                    <p className="text-sm text-muted-foreground">
                        公開レビューはまだありません。
                    </p>
                </div>
            ) : (
                <>
                    <div className="mt-4 space-y-4">
                        {publicReviews.map((publicReview) => (
                            <article
                                key={publicReview.id}
                                className="rounded-xl border p-6"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold ">
                                            {publicReview.reviewer_name}
                                        </p>

                                        {publicReview.created_at && (
                                            <time className="mt-1 block text-xs text-muted-foreground">
                                                {new Date(
                                                    publicReview.created_at,
                                                ).toLocaleDateString(
                                                    "ja-JP",
                                                )}
                                            </time>
                                        )}
                                    </div>

                                    {publicReview.spoiler && (
                                        <span className="rounded-full border px-3 py-1 text-xs">
                                            ネタバレあり
                                        </span>
                                    )}
                                </div>

                                <div className="mt-4 flex items-center gap-2">
                                    <span className="text-sm">
                                        総合評価：
                                    </span>
                                    {publicReview.evaluation !== null ? (
                                        <div
                                            className="flex items-center gap-1"
                                            aria-label={`総合評価: ${publicReview.evaluation} / 5`}
                                            >
                                                {[1,2,3,4,5].map(
                                                    (value) => (
                                                        <span
                                                            key={value}
                                                            className={
                                                                value <=
                                                                publicReview.evaluation!
                                                                    ? "text-yellow-500"
                                                                    : "text-muted-foreground/40"
                                                            }
                                                        >
                                                            ★
                                                        </span>
                                                    ),
                                                )}
                                        </div>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">
                                            未評価
                                        </span>
                                    )}
                                </div>

                                {publicReview.recommend_category && (
                                    <p className="mt-4 text-sm">
                                        おすすめカテゴリ：
                                        {
                                            publicReview.recommend_category
                                        }
                                    </p>

                                )}
                                {publicReview.spoiler ? (
                                    <details className="mt-4 rounded-lg bg-muted/50 p-4">
                                        <summary className="cursor-pointer">
                                            ネタバレを含むレビューを表示する
                                        </summary>

                                        <p className="mt-4 text-sm leading-6 whitespace-pre-wrap">
                                            {publicReview.comment ?? "レビューはありません。"}
                                        </p>
                                    </details>
                                ) : (
                                    <p className="mt-4 text-sm leading-6 whitespace-pre-wrap text-muted-foreground">
                                        {publicReview.comment ?? "レビューはありません。"}
                                    </p>
                                )}
                            </article>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-center">
                        <Link
                            href={`/animes/${malId}/reviews`}
                            className="rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                        >
                            すべてのレビューを見る
                        </Link>
                    </div>
                </>
            )}
        </section>
    );
}
