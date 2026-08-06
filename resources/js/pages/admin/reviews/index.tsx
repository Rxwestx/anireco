import { Head, Link, router } from "@inertiajs/react";
import Pagination from "@/components/ui/Pagination";


type AdminReview = {
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

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedAdminReviews = {
    data: AdminReview[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
};

type AdminReviewsIndexProps = {
    reviews: PaginatedAdminReviews;
};

export default function AdminReviewsIndex({
    reviews,
}: AdminReviewsIndexProps) {

    const handleHideReview = (reviewId: number) => {
        const shouldHide = window.confirm(
            'このレビューを非表示にしてもよろしいですか？'
        );
        if (!shouldHide) {
            return;
        }
        router.patch(
            `/admin/reviews/${reviewId}/hide`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <>
            <Head title="管理者レビュー管理" />
            <main className="mx-auto w-full max-w-6xl px-4 py-8">
                <header>
                    <h1 className="text-2xl font-bold">
                        公開レビュー管理
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        公開設定になっているレビューを確認できます。
                    </p>

                    <p className="mt-1 text-sm text-muted- foreground">
                        全{reviews.total}件中 {reviews.from}件目 〜 {reviews.to}件目を表示
                    </p>
                </header>

                {reviews.data.length === 0 ? (
                    <section className="mt-8 rounded-xl border p-6">
                        <p className="text-sm text-muted-foreground">
                            公開レビューはまだありません。
                        </p>
                    </section>
                ) : (
                    <section className="mt-8 space-y-4">
                        {reviews.data.map((review) => (
                            <article
                                key={review.id}
                                className="rounded-xl border p-6"
                            >
                                <div className="flex items-start justify-between gap-6">
                                    <div>
                                        <Link
                                            href={`/animes/${review.anime.mal_id}`}
                                            className="font-medium hover:underline"
                                        >
                                            {review.anime.title}
                                        </Link>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            投稿者：{review.reviewer_name}
                                        </p>

                                        {review.created_at && (
                                            <time className="mt-1 block text-xs text-muted-foreground">
                                                {new Date(
                                                    review.created_at,
                                                    ).toLocaleString('ja-JP')}
                                            </time>
                                        )}
                                    </div>
                                    {review.evaluation !== null ? (
                                        <div
                                            className="flex shrink-0 items-center gap-1"
                                            aria-label={`総合評価: ${review.evaluation} / 5`}
                                        >
                                            {[1,2,3,4,5].map(
                                                (value) => (
                                                    <span
                                                        key={value}
                                                        className={
                                                            value <=
                                                            review.evaluation!
                                                                ? 'text-yellow-500'
                                                                : 'text-muted-foreground/40'
                                                        }
                                                    >
                                                        ★
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    ) :(
                                        <span className="shrink-0 text-sm text-muted-foreground">
                                            評価なし
                                        </span>
                                    )}
                                </div>
                                <div className="mt-4 flex -items-center gap-2 text-xs">
                                    <span className="rounded-full border px-3 py-1">
                                        {review.publish
                                            ? '公開'
                                            : '非公開'}
                                    </span>

                                    {review.spoiler && (
                                        <span className="rounded-full border px-3 py-1">
                                            ネタバレあり
                                        </span>
                                    )}

                                    {review.is_hidden_by_admin && (
                                        <span className="rounded-full border border-red-300 px-3 py-1 text-red-600">
                                            管理者非表示
                                        </span>
                                    )}
                                </div>

                                {!review.is_hidden_by_admin && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleHideReview(review.id)}
                                        className="mt-4 rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                                    >
                                        非表示にする
                                    </button>
                                )}

                                {review.recommend_category && (
                                    <p className="mt-4 text-sm">
                                        おすすめカテゴリ:
                                        {review.recommend_category}
                                    </p>
                                )}

                                <p className="mt-4 text-sm leading-6 whitespace-pre-wrap text-muted-foreground">
                                    {review.comment ??
                                        'レビュー本文はありません。'}
                                </p>
                            </article>
                        ))}
                    </section>
                )}

                <Pagination
                    links={reviews.links}
                    lastPage={reviews.last_page}
                    ariaLabel="管理者レビュー一覧ページへ移動"
                />
            </main>
        </>
    );
}
