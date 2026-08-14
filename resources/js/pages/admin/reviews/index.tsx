
import { Head, Link, router, } from '@inertiajs/react';
import AdminReviewDetailDialog from '@/components/admin/AdminReviewDetailDialog';
import type { AdminReview } from '@/components/admin/AdminReviewDetailDialog';
import Pagination from '@/components/ui/Pagination';

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
    selectedVisibility: 'all' | 'public' | 'hidden';
};

export default function AdminReviewsIndex({
    reviews,
    selectedVisibility,
}: AdminReviewsIndexProps) {
    const handleVisibilityFilter = (
        visibility: 'all' | 'public' | 'hidden',
    ) => {
        router.get(
            '/admin/reviews',
            {
                visibility,
            },
            {
                preserveState: true,
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
                        レビュー管理
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        公開中レビューと管理者が非公開レビューを確認できます。
                    </p>
                    <div className="mt-6 flex border-b">
                        <button
                            type="button"
                            onClick={() => handleVisibilityFilter('all')}
                            className={`cursor-pointer border-b-2 px-4 py-2 text-sm font-medium transition ${
                                selectedVisibility === 'all'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            すべて
                        </button>
                        <button
                            type="button"
                            onClick={() => handleVisibilityFilter('public')}
                            className={`cursor-pointer border-b-2 px-4 py-2 text-sm font-medium transition ${
                                selectedVisibility === 'public'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            公開中
                        </button>
                        <button
                            type="button"
                            onClick={() => handleVisibilityFilter('hidden')}
                            className={`cursor-pointer border-b-2 px-4 py-2 text-sm font-medium transition ${
                                selectedVisibility === 'hidden'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            非公開
                        </button>
                    </div>

                    <p className="mt-4 text-sm text-muted-foreground">
                        全{reviews.total}件中 {reviews.from}件目 〜 {reviews.to}件目を表示
                    </p>
                </header>

                {reviews.data.length === 0 ? (
                    <section className="mt-8 rounded-xl border p-6">
                        <p className="text-sm text-muted-foreground">
                            レビューはまだありません。
                        </p>
                    </section>
                ) : (
                    <section className="mt-8 overflow-hidden rounded border">
                        <table className="w-full table-fixed border-collapse text-left text-sm">
                            <thead className="bg-muted">
                                <tr className="border-b">
                                    <th className="w-[140px] px-4 py-3 text-sm">
                                        投稿者名
                                    </th>

                                    <th className="w-[260px] px-4 py-3 font-semibold">
                                        作品名
                                    </th>

                                    <th className="px-4 py-3 font-semibold">
                                        レビュー内容
                                    </th>

                                    <th className="w-[120px] px-4 py-3 font-semibold">
                                        投稿日
                                    </th>

                                    <th className="w-[100px] px-4 py-3 font-semibold">
                                        公開状態
                                    </th>

                                    <th className="w-[80px] px-4 py-3  text-center font-semibold">
                                        詳細
                                    </th>
                                </tr>
                            </thead>


                            <tbody>
                                {reviews.data.map((review) => {
                                    const isPublic =
                                        review.publish &&
                                        !review.is_hidden_by_admin;

                                        return (
                                        <tr
                                            key={review.id}
                                            className="border-b last:border-b-0"
                                            >
                                            <td className="px-4 py-3 align-middle">
                                                <p className="block truncate">
                                                    {review.reviewer_name}
                                                </p>
                                            </td>

                                            <td className="px-4 py-3 align-middle">
                                                <Link
                                                    href={`/admin/anime/${review.anime.mal_id}`}
                                                    className="block truncate hover:underline"
                                                >
                                                    {review.anime.title}
                                                </Link>
                                            </td>

                                            <td className="px-4 py-3 align-middle">
                                                <p className="truncate text-muted-foreground"
                                                title={review.comment ?? 'レビュー内容はありません。'}>
                                                {review.comment ??
                                                    'レビュー内容はありません。'}
                                                </p>
                                            </td>

                                            <td className="px-4 py-3 align-middle">
                                                {review.created_at
                                                ? new Date(
                                                    review.created_at,
                                                ).toLocaleDateString(
                                                    'ja-JP',
                                                )
                                                : '投稿日不明'}
                                            </td>

                                            <td className="px-4 py-3 align-middle">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                        isPublic
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {isPublic
                                                        ? "公開"
                                                        : "非公開"}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 text-center align-middle">
                                                <AdminReviewDetailDialog
                                                    review={review}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
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
