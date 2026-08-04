import Pagination from '@/components/ui/Pagination';
import { Head, Link } from '@inertiajs/react';

type Anime = {
    id: number;
    title: string;
    main_picture: {
        medium: string;
        large: string;
    } | null;
};

type PublicReview = {
    id: number;
    evaluation: number | null;
    comment: string | null;
    recommend_category: string | null;
    spoiler: boolean;
    reviewer_name: string;
    created_at: string | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedPublicReviews = {
    data: PublicReview[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
};

type ReviewsPageProps = {
    anime: Anime;
    publicReviews: PaginatedPublicReviews;
};

export default function ReviewsIndex({
    anime,
    publicReviews
}: ReviewsPageProps) {
    return (
        <>
            <Head title={`${anime.title} - 公開レビュー`} />

            <main className="mx-auto w-full max-w-4xl px-4 py-8">
                <Link
                    href={`/animes/${anime.id}`}
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    ◀︎ アニメ作品詳細に戻る
                </Link>

                <header className="mt-6 flex items-start gap-4">
                    {anime.main_picture && (
                        <img
                            src={
                                anime.main_picture.medium ??
                                anime.main_picture.large
                            }
                            alt={anime.title}
                            className="h-32 w-24 rounded-lg object-cover"
                        />
                    )}

                    <div>
                        <h1 className="text-2xl font-bold">
                            {anime.title}
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            公開レビュー
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            全{publicReviews.total}件
                        </p>
                    </div>
                </header>

                {publicReviews.data.length === 0 ? (
                    <section className="mt-8 rounded-xl border p-6">
                        <p className="text-sm text-muted-foreground">
                            公開レビューはまだありません。
                        </p>
                    </section>
                ) : (
                    <section className="mt-8 space-y-4">
                        {publicReviews.data.map((publicReview) => (
                            <article
                                key={publicReview.id}
                                className="rounded-xl border p-6"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-medium">
                                            {publicReview.reviewer_name}
                                        </p>

                                        {publicReview.created_at && (
                                            <time className="mt-1 block text-xs text-muted-foreground">
                                                {new Date(
                                                    publicReview.created_at,
                                                ).toLocaleDateString(
                                                    'ja-JP',
                                                )}
                                            </time>
                                        )}
                                    </div>

                                    {publicReview.evaluation !== null ? (
                                        <div
                                            className="flex items-center gap-1"
                                            aria-label={`総合評価: ${publicReview.evaluation} / 5`}
                                        >
                                            {[1, 2, 3, 4, 5].map(
                                                (value) => (
                                                    <span
                                                        key={value}
                                                        className={
                                                            value <=
                                                            publicReview.evaluation!
                                                                ? 'text-yellow-500'
                                                                : 'text-muted-foreground/40'
                                                        }
                                                    >
                                                        ★
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">
                                            評価なし
                                        </span>
                                    )}
                                </div>

                                {publicReview.recommend_category && (
                                    <p className="mt-4 text-sm">
                                        おすすめカテゴリ:
                                        {publicReview.recommend_category}
                                    </p>
                                )}

                                {publicReview.spoiler ? (
                                    <details className="mt-4">
                                        <summary className="cursor-pointer text-sm font-medium">
                                            ネタバレを含むレビューを表示する
                                        </summary>

                                        <p className="mt-3 text-sm leading-6 whitespace-pre-wrap text-muted-foreground">
                                            {publicReview.comment ??
                                                'レビューはありません。'}
                                        </p>
                                    </details>
                                ) : (
                                    <p className="mt-4 text-sm leading-6 whitespace-pre-wrap text-muted-foreground">
                                        {publicReview.comment ??
                                            'レビューはありません。'}
                                    </p>
                                )}
                            </article>
                        ))}
                    </section>
                )}
                <Pagination
                    links={publicReviews.links}
                    lastPage={publicReviews.last_page}
                    ariaLabel="公開レビューのページ移動"
                />
            </main>
        </>
    );
}
