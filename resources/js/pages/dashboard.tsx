import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import UpdateAnimeStatusDialog from '@/components/ui/UpdateAnimeStatusDialog';
import WatchNoteDialog from '@/components/ui/WatchNoteDialog';

type AnimeMaster ={
    id: number;
    mal_id: number;
    title: string;
    cover_image: string | null;
    description: string | null;
    genre: string | null;
    broadcast_year: string | null;
};

type WachingStatus =
    | 'want_to_watch'
    | 'watching'
    | 'completed'
    | 'dropped';

type UserAnime = {
    id : number;
    status: WachingStatus;
    statusLabel: string;
    created_at: string | null;
    attachedEmotionTagIds: number[];
    anime_master: AnimeMaster;
};

type EmotionTag = {
    id: number;
    name: string;
};

type RecentWatchNote = {
    id: number;
    content: string;
    created_at: string | null;
    anime:{
        mal_id: number;
        title: string;
    };
};
type RecentReview = {
    id: number;
    evaluation: number | null;
    updated_at: string | null;
    anime:{
        mal_id: number;
        title: string;
        cover_image: string | null;
    };
};

const recommendCategories = [
    '泣きたい時に泣ける',
    '熱くなりたい時に熱くなれる',
    'ほっこり癒される',
    '感慨深い',
    '笑える',
    '一気見推奨',
];

type DashboardProps = {
    userAnimes: UserAnime[];
    recentlyAdded: UserAnime[];
    recentWatchNotes: RecentWatchNote[];
    recentReviews: RecentReview[];
    selectedStatus: string | null;
    keyword: string | null;
    hasRegisteredAnimes: boolean;
    selectedSort:
        |'newest'
        |'oldest'
        |'evaluation_desc'
        |'evaluation_asc';
    emotionTags: EmotionTag[];
    selectedEmotionTagIds: number[];
    selectedRecommendCategory: string | null;
};

export default function Dashboard({
        userAnimes,
        recentlyAdded,
        recentWatchNotes,
        recentReviews,
        selectedStatus,
        keyword,
        hasRegisteredAnimes,
        selectedSort,
        emotionTags,
        selectedEmotionTagIds,
        selectedRecommendCategory,
}: DashboardProps) {

    const [searchKeyword, setSearchKeyword] = useState(keyword ?? '');

    // 感情タグの絞り込み処理
    const handleEmotionTagFilter = (emotionTagId: number | null) => {
        const nextEmotionTagIds =
            emotionTagId === null
            ? []
            :selectedEmotionTagIds.includes(emotionTagId)
                ? selectedEmotionTagIds.filter(
                    (selectedId) => selectedId !== emotionTagId,
                )
                : [...selectedEmotionTagIds, emotionTagId];

        router.get(
            '/dashboard',
            {
                ...(selectedStatus ? { status: selectedStatus } : {}),
                ...(searchKeyword ? { keyword: searchKeyword } : {}),
                ...(nextEmotionTagIds.length > 0
                    ? { emotion_tag_ids: nextEmotionTagIds }
                    : {}),
                ...(selectedRecommendCategory
                    ? { recommend_category: selectedRecommendCategory }
                    : {}),
                sort: selectedSort,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

        const handleStatusFilter = (status: string | null) => {
            router.get(
                '/dashboard',
                {
                    ...(status ? { status } : {}),
                    ...(searchKeyword ? { keyword: searchKeyword } : {}),
                    ...(selectedEmotionTagIds.length > 0
                        ? { emotion_tag_ids: selectedEmotionTagIds }
                        : {}),
                    ...(selectedRecommendCategory
                        ? { recommend_category: selectedRecommendCategory }
                        : {}),
                    sort: selectedSort,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                }
            );
        };

        const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
        router.get(
            '/dashboard',
            {
                ...(selectedStatus ? { status: selectedStatus } : {}),
                    ...(searchKeyword ? { keyword: searchKeyword } : {}),
                ...(selectedEmotionTagIds.length > 0
                    ? { emotion_tag_ids: selectedEmotionTagIds }
                    : {}),
                ...(selectedRecommendCategory
                    ? { recommend_category: selectedRecommendCategory }
                    : {}),
                sort: selectedSort,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleSortChange = (
        sort:
            |'newest'
            | 'oldest'
            |'evaluation_desc'
            |'evaluation_asc',
        ) => {
        router.get(
            '/dashboard',
            {
                ...(selectedStatus ? { status: selectedStatus } : {}),
                ...(searchKeyword ? { keyword: searchKeyword } : {}),
                ...(selectedEmotionTagIds.length > 0
                    ? { emotion_tag_ids: selectedEmotionTagIds }
                    : {}),
                ...(selectedRecommendCategory
                    ? { recommend_category: selectedRecommendCategory }
                    : {}),
                sort,
            },
            {
                    preserveState: true,
                    preserveScroll: true,
            },
        );
    };

    const handleRecommendCategoryFilter = (
        recommendCategory: string | null,
    ) => {
        router.get(
            '/dashboard',
            {
                ...(selectedStatus ? { status: selectedStatus } : {}),
                ...(searchKeyword ? { keyword: searchKeyword } : {}),
                ...(selectedEmotionTagIds.length > 0
                    ? { emotion_tag_ids: selectedEmotionTagIds }
                    : {}),
                ...(recommendCategory
                    ? { recommend_category: recommendCategory }
                    : {}),
                sort: selectedSort,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleClearFilters = () => {
        setSearchKeyword('');
        router.get(
            '/dashboard',
            {
                sort: 'newest',
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <>
            <Head title="マイページ" />
            <div className="flex items-start gap-6">
                <div className="min-w-0 flex-1">
                    <section>
                        <h1 className="text-2xl font-bold">マイページ</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            登録したアニメの管理や、最近追加したアニメの確認ができます。
                        </p>
                    </section>

                    <section>
                    <h2 className="mb-4 text-xl font-semibold">登録アニメ作品
                    </h2>

                    <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                        <input
                            type="text"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            placeholder="登録作品タイトルで検索"
                            className="min-w-0 flex-1 rounded-md border bg-background px-3 py-2 text-sm"
                        />
                        <button
                            type="submit"
                            className="cursor-pointer rounded-md border bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/80"
                        >
                            検索
                        </button>
                    </form>

                    <div className="mb-4 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="cursor-pointer rounded-md border bg-muted px-4 py-2 text-sm hover:bg-muted"
                        >
                            条件をクリア
                        </button>

                        <select
                            value={selectedSort}
                            onChange={(e) =>
                                handleSortChange(
                                    e.target.value as
                                        |'newest'
                                        | 'oldest'
                                        | 'evaluation_desc'
                                        | 'evaluation_asc'
                                )
                            }
                            className="cursor-pointer rounded-md border bg-background px-3 py-2 text-sm"
                        >
                            <option value="newest">新しく登録した順</option>
                            <option value="oldest">古く登録した順</option>
                            <option value="evaluation_desc">評価の高い順</option>
                            <option value="evaluation_asc">評価の低い順</option>
                        </select>
                    </div>

                    {emotionTags.length > 0 && (
                        <div className="mb-4">
                            <p className="mb-2 font-medium text-sm">
                                感情タグで絞り込み
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleEmotionTagFilter(null)}
                                    className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm ${
                                        selectedEmotionTagIds.length === 0
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted'
                                    }`}
                                >
                                    すべてのタグ
                            </button>

                            {emotionTags.map((emotionTag) => (
                                <button
                                    key={emotionTag.id}
                                    type="button"
                                    onClick={() =>
                                        handleEmotionTagFilter(emotionTag.id)
                                    }
                                    className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm ${
                                        selectedEmotionTagIds.includes(emotionTag.id)
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted'
                                    }`}
                                >
                                    {emotionTag.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    )}

                    <div className="mb-4">
                        <p className="mb-2 font-medium">
                            おすすめカテゴリで絞り込み
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => handleRecommendCategoryFilter(null)}
                                className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm ${
                                    selectedRecommendCategory === null
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-muted'
                                }`}
                            >
                                すべてのカテゴリ
                            </button>

                            {recommendCategories.map((recommendCategory) => (
                                <button
                                    key={recommendCategory}
                                    onClick={() =>
                                        handleRecommendCategoryFilter(recommendCategory)
                                    }
                                    className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm ${
                                        selectedRecommendCategory === recommendCategory
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted'
                                    }`}
                                >
                                    {recommendCategory}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => handleStatusFilter(null)}
                            className={`rounded-md border px-3 py-2 text-sm ${
                                selectedStatus === null
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted'
                            }`}
                        >
                            すべて
                        </button>
                        <button
                            type="button"
                            onClick={() => handleStatusFilter('want_to_watch')}
                            className={`rounded-md border px-3 py-2 text-sm ${
                                selectedStatus === 'want_to_watch'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted'
                            }`}
                        >
                            見たい
                        </button>
                        <button
                            type="button"
                            onClick={() => handleStatusFilter('watching')}
                            className={`rounded-md border px-3 py-2 text-sm ${
                                selectedStatus === 'watching'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted'
                            }`}
                        >
                            視聴中
                        </button>
                        <button
                            type="button"
                            onClick={() => handleStatusFilter('completed')}
                            className={`rounded-md border px-3 py-2 text-sm ${
                                selectedStatus === 'completed'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted'
                            }`}
                        >
                            視聴済み
                        </button>
                        <button
                            type="button"
                            onClick={() => handleStatusFilter('dropped')}
                            className={`rounded-md border px-3 py-2 text-sm ${
                                selectedStatus === 'dropped'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted'
                            }`}
                        >
                            断念
                        </button>
                    </div>

                    {userAnimes.length === 0 ? (
                        <div className="rounded-xl border p-6">
                            <p className="text-muted-foreground">
                                {!hasRegisteredAnimes
                                    ? '登録したアニメ作品はありません。'
                                    : selectedStatus
                                    ? 'このステータスに登録アニメ作品はありません。'
                                    : '検索条件に一致する登録アニメ作品はありません。'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-5 gap-4">
                                {userAnimes.map((userAnime) => (
                                    <article
                                        key={userAnime.id}
                                        className="rounded-xl border p-4">
                                        <Link
                                            href={`/animes/${userAnime.anime_master.mal_id}`}
                                            className="block p-4 transition hover:bg-muted/50">
                                            {userAnime.anime_master.cover_image ? (
                                                <img
                                                    src={userAnime.anime_master.cover_image}
                                                    alt={userAnime.anime_master.title}
                                                    className="w-full rounded-lg object-cover"
                                                />

                                            ) : (
                                                <div className="flex items-center justify-center rounded-lg bg-muted-foreground">
                                                    <span className="text-sm text-muted-foreground">
                                                        No Image
                                                    </span>
                                                </div>
                                            )}
                                            <div className="mt-4">
                                                <h3 className="text-lg font-semibold">
                                                    {userAnime.anime_master.title}
                                                </h3>
                                            </div>

                                        </Link>
                                        <div className="px-4 pb-4" >
                                            <UpdateAnimeStatusDialog
                                                userAnimeId={userAnime.id}
                                                currentStatus={userAnime.status}
                                            />

                                            <WatchNoteDialog
                                                userAnimeId={userAnime.id}
                                                emotionTags={emotionTags}
                                                attachedEmotionTagIds={
                                                    userAnime.attachedEmotionTagIds
                                                }
                                            />
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
                <aside className="flex w-[320px] shrink-0 flex-col gap-4">
                    <div className="rounded-xl border bg-white p-5">
                        <h2 className="mb-4 text-sm font-extrabold text-muted-foreground">
                            最近追加したアニメ作品
                            </h2>
                        <div className="flex flex-col gap-3">
                            {recentlyAdded.map((userAnime) => (
                                <Link
                                    key={userAnime.id}
                                    href={`/animes/${userAnime.anime_master.mal_id}`}
                                    className="flex items-center gap-3"
                                    >
                                    {userAnime.anime_master.cover_image ? (
                                        <img
                                            src={userAnime.anime_master.cover_image}
                                            alt={userAnime.anime_master.title}
                                            className="w-16 h-12 shrink-0 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="h-16 w-12 rounded-lg bg-muted"/>
                                    )}

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-bold text-[#333]"
                                            title={userAnime.anime_master.title}
                                        >
                                            {userAnime.anime_master.title}
                                        </p>

                                        <p className="m-1 text-sm text-[#999]">
                                            登録日: {userAnime.created_at}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                        <div className="rounded-xl border bg-white p-5">
                            <h2 className="mb-4 text-sm font-extrabold text-[#333]">
                                最近記入した視聴メモ
                            </h2>

                            <div className="flex flex-col gap-4">
                                {recentWatchNotes.map((watchNote) => (
                                    <Link
                                        key={watchNote.id}
                                        href={`/animes/${watchNote.anime.mal_id}`}
                                        className="block"
                                    >
                                        <p className="truncate text-sm font-bold text-[#333]"
                                            title={watchNote.anime.title}
                                        >
                                            {watchNote.anime.title}
                                        </p>

                                        <p className="mt-1 text-sm text-[#666]">
                                            {watchNote.content}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-xl border bg-white p-5">
                            <h2 className="mb-4 text-sm font-extrabold text-[#333]">
                                最近書いたレビュー
                            </h2>
                            <div className="flex flex-col gap-3">
                                {recentReviews.map((review) => (
                                    <Link
                                        key={review.id}
                                        href={`/animes/${review.anime.mal_id}`}
                                        className="flex items-center gap-3"
                                    >
                                        {review.anime.cover_image ? (
                                        <img
                                            src={review.anime.cover_image}
                                            alt={review.anime.title}
                                            className="h-16 w-12 shrink-0 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="h-16 w-12 shrink-0 rounded-lg bg-muted"/>
                                    )}

                                    <div className="min-w-0">
                                        {/* <p className="text-sm text-[#999]">
                                            更新日: {review.updated_at}
                                        </p> */}

                                        <p className="truncate text-sm font-bold text-[#333]"
                                            title={review.anime.title}
                                        >
                                            {review.anime.title}
                                        </p>

                                        <p className="mt-1 text-sm text-[#666]">
                                            評価：
                                                {review.evaluation !== null
                                                ? `${review.evaluation} / 5`
                                                : '未評価'}
                                        </p>
                                    </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                </aside>
            </div>
        </>
    );
}
