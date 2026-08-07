import { Head, Link, router } from "@inertiajs/react";
import Pagination from "@/components/ui/Pagination";
import AdminReviewDetailDialog, {
    type AdminReview,
} from "@/components/admin/AdminReviewDetailDialog";

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

    return (
        <>
            <Head title="管理者レビュー管理" />
            <main className="mx-auto w-full max-w-6xl px-4 py-8">
                <header>
                    <h1 className="text-2xl font-bold">
                        レビュー管理
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
                            レビューはまだありません。
                        </p>
                    </section>
                ) : (
                    <section className="mt-8 overflow-hidden rounded border">
                        <table className="w-full table-fixed border-collapse text-left text-sm">
                            <thead className="bg-muted">
                                <tr className="border-b">
                                    <th className="w-1/4 border-b px-4 py-2 text-sm">
                                        投稿者名
                                    </th>

                                    <th className="px-4 py-2 font-semibold">
                                        レビュー内容
                                    </th>

                                    <th className="w-[120px] px-4 py-4 font-semibold">
                                        投稿日
                                    </th>

                                    <th className="w-[100px] px-4 py-4 font-semibold">
                                        公開状態
                                    </th>

                                    <th className="w-[80px] px-4 py-4  text-center font-semibold">
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
                                            <td className="px-4 py-4 align-middle">
                                                <p className="truncate">
                                                    {review.reviewer_name}
                                                </p>
                                            </td>

                                            <td className="px-4 py-2 align-middle">
                                                <p className="truncate text-muted-foreground">
                                                {review.comment ??
                                                    'レビュー内容はありません。'}
                                                </p>
                                            </td>

                                            <td className="px-4 py-4 align-middle">
                                                {review.created_at
                                                ? new Date(
                                                    review.created_at,
                                                ).toLocaleDateString(
                                                    'ja-JP',
                                                )
                                                : '投稿日不明'}
                                            </td>

                                            <td className="px-4 py-4 align-middle">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                        isPublic
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-muted text-muted-foreground"
                                                    }`}
                                                >
                                                    {isPublic
                                                        ? "公開"
                                                        : "非公開"}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 text-center align-middle">
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
