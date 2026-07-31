import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import UpdateAnimeStatusDialog from '@/components/ui/UpdateAnimeStatusDialog';


type AnimeMaster ={
    id: number;
    mal_id: number;
    title: string;
    cover_image: string | null;
    description: string | null;
    genre: string | null;
    broadcast_year: string | null;
};

type UserAnime = {
    id : number;
    status: string;
    statusLabel: string;
    created_at: string | null;
    anime_master: AnimeMaster;
};

type EmotionTag = {
    id: number;
    name: string;
};

type DashboardProps = {
    userAnimes: UserAnime[];
    recentlyAdded: UserAnime[];
    selectedStatus: string | null;
    keyword: string | null;
    hasRegisteredAnimes: boolean;
    selectedSort: 'newest' | 'oldest';
    emotionTags: EmotionTag[];
    selectedEmotionTagId: number | null;
};

export default function Dashboard({
        userAnimes,
        recentlyAdded,
        selectedStatus,
        keyword,
        hasRegisteredAnimes,
        selectedSort,
        emotionTags,
        selectedEmotionTagId,
}: DashboardProps) {

    const [searchKeyword, setSearchKeyword] = useState(keyword ?? '');

    // 感情タグの絞り込み処理
    const handleEmotionTagFilter = (emotionTagId: number | null) => {
        router.get(
            '/dashboard',
            {
                ...(selectedStatus ? { status: selectedStatus } : {}),
                ...(searchKeyword ? { keyword: searchKeyword } : {}),
                ...(emotionTagId
                    ? { emotion_tag_id: emotionTagId }
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
                    ...(selectedEmotionTagId
                        ? { emotion_tag_id: selectedEmotionTagId }
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
                ...(selectedEmotionTagId
                    ? { emotion_tag_id: selectedEmotionTagId }
                    : {}),
                sort: selectedSort,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleSortChange = (sort: 'newest' | 'oldest') => {
        router.get(
            '/dashboard',
            {
                ...(selectedStatus ? { status: selectedStatus } : {}),
                ...(searchKeyword ? { keyword: searchKeyword } : {}),
                ...(selectedEmotionTagId
                    ? { emotion_tag_id: selectedEmotionTagId }
                    : {}),
                sort,
            },
            {
                    preserveState: true,
                    preserveScroll: true,
            },
        );
    };

    return (
        <>
            <Head title="マイページ" />
            <div className="flex h-full flex-1 flex-col gap-8 p-6">
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

                <div className="mb-4 flex justify-end">
                    <select
                        value={selectedSort}
                        onChange={(e) =>
                            handleSortChange(
                                e.target.value as 'newest' | 'oldest'
                            )
                        }
                        className="cursor-pointer rounded-md border bg-background px-3 py-2 text-sm"
                    >
                        <option value="newest">新しく登録した順</option>
                        <option value="oldest">古く登録した順</option>
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
                                    selectedEmotionTagId === null
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
                                    selectedEmotionTagId === emotionTag.id
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
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
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
                                                className="aspect-[3/4] w-full rounded-lg object-cover"
                                            />

                                        ) : (
                                            <div className="flex aspect-[3/4] items-center justify-center rounded-lg bg-muted-foreground">
                                                <span className="text-sm text-muted-foreground">
                                                    No Image
                                                </span>
                                            </div>
                                        )}
                                        <div className="mt-4">
                                            <h3 className="text-lg font-semibold">
                                                {userAnime.anime_master.title}
                                            </h3>
                                            <p className="m-1 text-sm text-muted-foreground">
                                                {userAnime.statusLabel}</p>
                                        </div>

                                    </Link>
                                    <div className="px-4 pb-4" >
                                        <UpdateAnimeStatusDialog
                                            userAnimeId={userAnime.id}
                                            currentStatus={userAnime.status}
                                        />
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
                <section>
                    <h2 className="mb-4 text-xl font-semibold">
                        最近追加したアニメ作品
                        </h2>
                    <div className="space-y-3">
                        {recentlyAdded.map((userAnime) => (
                            <div
                                key={userAnime.id}
                                className="rounded-xl border p-4">
                                <p className="font-medium">
                                        {userAnime.anime_master.title}
                                </p>
                                <p className="m-1 text-sm text-muted-foreground">
                                    登録日：{userAnime.created_at}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}

// Dashboard.layout = {
//     breadcrumbs: [
//         {
//             title: 'マイページ',
//             href: dashboard(),
//         },
//     ],
// };
