import {
    Head,
    Link,
    router,
    useForm,
    usePage,
} from '@inertiajs/react';

import WatchNoteList from '@/components/ui/WatchNoteList';
import { useState } from 'react';
import PublicReviewList from '@/components/animes/PublicReviewList';
import CreateEmotionTagDialog from '@/components/ui/CreateEmotionTagDialog';
import CreateReviewDialog from '@/components/ui/CreateReviewDialog';
import EditReviewDialog from '@/components/ui/EditReviewDialog';
import RegisterAnimeDialog from '@/components/ui/RegisterAnimeDialog';
import UpdateAnimeStatusDialog from '@/components/ui/UpdateAnimeStatusDialog';
import type { Auth } from '@/types';

type WatchingStatus = 'want_to_watch' | 'watching' | 'completed' | 'dropped';

type Anime = {
    id: number;
    title: string;
    main_picture?: {
        medium: string;
        large: string;
    };
    start_date?: string;
    synopsis?: string;
    genres?: {
        id: number;
        name: string;
    }[];
    source?: string | null;
    num_episodes?: number | null;
    user_anime_id: number | null;
    registered_status: WatchingStatus | null;
};

type EmotionTag = {
    id: number;
    name: string;
};

type WatchNote = {
    id: number;
    episode?: number | null;
    content: string;
    created_at: string;
};

type Review = {
    id: number;
    evaluation: number | null;
    comment: string | null;
    recommend_category: string | null;
    publish: boolean;
    spoiler: boolean;
    is_hidden_by_admin: boolean;
    created_at: string | null;
    updated_at: string | null;
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

type ShowProps = {
    anime: Anime;
    emotionTags: EmotionTag[];
    attachedEmotionTagIds: number[];
    watchNotes: WatchNote[];
    review: Review | null;
    publicReviews?: PublicReview[];
};

const sourceLabels: Record<string, string> = {
    manga: '漫画',
    light_novel: 'ライトノベル',
    novel: '小説',
    original: 'オリジナル',
    visual_novel: 'ビジュアルノベル',
    game: 'ゲーム',
    web_manga: 'web漫画',
    web_novel: 'web小説',
    book: '書籍',
    music: '音楽',
    card_game: 'カードゲーム',
    other: 'その他',
};

export default function Show({
    anime,
    emotionTags,
    attachedEmotionTagIds,
    watchNotes,
    review,
    publicReviews = [],
}: ShowProps) {
    const { auth } = usePage<{ auth: Auth }>().props;

    const [activeTab, setActiveTab] = useState<
        'watchNotes' | 'review'
    >('watchNotes');

    const tagForm = useForm({
        emotion_tag_id: '',
    });

    const attachedEmotionTags = emotionTags.filter((emotionTag) =>
        attachedEmotionTagIds.includes(emotionTag.id),
    );

    const availableEmotionTags = emotionTags.filter(
        (emotionTag) => !attachedEmotionTagIds.includes(emotionTag.id),
    );

    const handleDeleteReview = (reviewId: number) => {
        if (anime.user_anime_id === null) {
            return;
        }

        const shouldDelete = window.confirm(
            'このレビューを削除しますか？'
        );

        if (!shouldDelete) {
            return;
        }

        router.delete(
            `/user-animes/${anime.user_anime_id}/reviews/${reviewId}`,
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <>
            <Head title={anime.title} />
            <main className="mx-auto w-full max-w-6xl px-4 py-8">
                <div className="grid gap-8 md:grid-cols-[300px_1fr]">
                    <section>
                        <div className="aspect-[2/3] w-full overflow-hidden rounded-xl bg-muted">
                            {anime.main_picture ? (
                                <img
                                    src={
                                        anime.main_picture.large ??
                                        anime.main_picture.medium
                                    }
                                    alt={anime.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                    'No Image'
                                </div>
                            )}
                        </div>
                    </section>

                    <section>
                        <h1 className="text-3xl font-bold">{anime.title}</h1>

                        <div className="mt-4 space-y-3">
                            <p className="text-sm text-muted-foreground">
                                {anime.start_date ?? '放送年未定'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                原作：
                                {anime.source
                                    ? (sourceLabels[anime.source] ??
                                        anime.source)
                                    : '情報なし'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                総話数：
                                {anime.num_episodes !== null &&
                                anime.num_episodes !== undefined
                                    ? `${anime.num_episodes}話`
                                    : '情報なし'}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {anime.genres && anime.genres.length > 0 ? (
                                    anime.genres.map((genre) => (
                                        <span
                                            key={genre.id}
                                            className="rounded-full bg-muted px-3 py-1 text-sm"
                                        >
                                            {genre.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-sm text-muted-foreground">
                                        ジャンル情報なし
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="mt-8">
                            <h2 className="text-2xl font-bold">あらすじ</h2>
                            <p className="mt-3 leading-7 whitespace-pre-line text-muted-foreground">
                                {anime.synopsis ?? 'あらすじ未定'}
                            </p>
                        </div>
                        <div className="mt-4 max-w-xs">
                            {!auth.user ? (
                                <Link
                                    href="/login"
                                    className="block w-full rounded-md px-4 py-2 text-center text-sm font-medium hover:bg-muted"
                                >
                                    +登録する
                                </Link>
                            ) : anime.registered_status &&
                                    anime.user_anime_id ? (
                                <UpdateAnimeStatusDialog
                                    userAnimeId={anime.user_anime_id}
                                    currentStatus={anime.registered_status}
                                />
                            ) : (
                                <RegisterAnimeDialog anime={anime} />
                            )}
                        </div>
                    </section>
                </div>

                {auth.user && anime.user_anime_id && (
                    <section className="mt-12 rounded-lg bg-muted/50 p-6">
                        <h2 className="text-sm font-semibold">感情タグ</h2>
                        {attachedEmotionTags.length > 0 ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {attachedEmotionTags.map((emotionTag) => (
                                    <div
                                        key={emotionTag.id}
                                        className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm"
                                    >
                                        <span>{emotionTag.name}</span>

                                        <button
                                            type="button"
                                            aria-label={`${emotionTag.name}を外す`}
                                            title="この作品から外す"
                                            disabled={tagForm.processing}
                                            onClick={() => {
                                                tagForm.delete(
                                                    `/user-animes/${anime.user_anime_id}/emotion-tags/${emotionTag.id}`,
                                                    {
                                                        preserveScroll: true,
                                                    },
                                                );
                                            }}
                                            className="cursor-pointer text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                ×
                                            </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-4 text-sm text-muted-foreground">
                                この作品には、感情タグが付いていません。
                            </p>
                        )}
                        {emotionTags.length === 0 ? (
                            <p className="mt-4 text-sm text-muted-foreground">
                                感情タグが登録されていません。
                            </p>
                        ) : availableEmotionTags.length === 0 ? (
                            <p className="mt-4 text-sm text-muted-foreground">
                                登録済みの感情タグは、すべてこの作品に付いています。
                            </p>
                        ) : (
                            <div className="mt-4">
                                <p className="mb-2 text-xs text-muted-foreground">
                                    追加するタグを選択
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {availableEmotionTags.map((emotionTag) => (
                                        <button
                                            key={emotionTag.id}
                                            type="button"
                                            disabled={tagForm.processing}
                                            onClick={() => {
                                                tagForm.setData(
                                                    'emotion_tag_id',
                                                    String(emotionTag.id),
                                                );

                                                tagForm.post(
                                                    `/user-animes/${anime.user_anime_id}/emotion-tags`,
                                                    {
                                                        preserveScroll: true,
                                                        onSuccess: () => {
                                                            tagForm.reset(
                                                                'emotion_tag_id',
                                                            );
                                                        },
                                                    },
                                                );
                                            }}
                                            className="cursor-pointer rounded-full border bg-background px-3 py-1.5 text-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            + {emotionTag.name}
                                        </button>
                                    ))}
                                </div>

                                {tagForm.errors.emotion_tag_id && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {tagForm.errors.emotion_tag_id}
                                    </p>
                                )}
                            </div>
                        )}
                        <div className="mt-4">
                            <CreateEmotionTagDialog
                                buttonLabel="+ 新しい感情タグを作る"
                                buttonClassName="cursor-pointer  rounded-md border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
                            />
                        </div>
                    </section>
                )}

                {auth.user && anime.user_anime_id && (
                    <section className="mt-10">
                        <div className="flex items-center border-b">
                            <div className="flex gap-8">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('watchNotes')}
                                    className={`cursor-pointer pb-2 text-sm ${
                                        activeTab === 'watchNotes'
                                            ? 'border-b-2 border-foreground font-semibold'
                                            : 'text-muted-foreground'
                                    }`}
                                >
                                    視聴メモ
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('review')}
                                    className={`cursor-pointer pb-2 text-sm ${
                                        activeTab === 'review'
                                            ? 'border-b-2 border-foreground font-semibold'
                                            : 'text-muted-foreground'
                                    }`}
                                >
                                    レビュー
                                </button>
                            </div>
                        </div>

                        {activeTab === 'watchNotes' ? (
                            <WatchNoteList
                                userAnimeId={anime.user_anime_id}
                                watchNotes={watchNotes}
                                emotionTags={emotionTags}
                                attachedEmotionTagsIds={attachedEmotionTagIds}
                            />
                        ): (
                        <>
                            {anime.registered_status !== 'completed' ? (
                                <div className="mt-4 rounded-xl border p-6">
                                    <p className="text-sm text-muted-foreground">
                                        レビューは、視聴済みの作品のみ投稿できます。
                                    </p>
                                </div>
                            ) : review === null ? (
                                <div className="mt-4">
                                    <CreateReviewDialog
                                        userAnimeId={anime.user_anime_id}
                                    />
                                </div>
                            ) : (
                                <article className="mt-4 rounded-xl border p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">
                                                総合評価:
                                            </span>

                                            {review.evaluation !== null ? (
                                                <div
                                                    className="flex items-center gap-1"
                                                    aria-label={`総合評価: ${review.evaluation}点`}
                                                >

                                                {[1,2,3,4,5].map((value) => (
                                                    <span
                                                        key={value}
                                                        className={
                                                            value <= review.evaluation!
                                                                ? 'text-yellow-500'
                                                                : 'text-muted-foreground/40'
                                                        }
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">
                                                    未評価
                                                </span>
                                            )}
                                        </div>

                                        <span className="rounded-full bg-muted px-3 py-1 text-xs">
                                            {review.publish ? '公開' : '非公開'}
                                        </span>

                                        {review.spoiler && (
                                            <span className="rounded-full border px-3 py-1 text-xs">
                                                ネタバレあり
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                    <EditReviewDialog
                                        userAnimeId={anime.user_anime_id}
                                        review={review}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteReview(review.id)
                                        }
                                        className="cursor-pointer text-sm text-red-600 hover:underline"
                                    >
                                        削除
                                    </button>
                                    </div>
                                </div>

                                    {review.recommend_category && (
                                        <p className="mt-4 text-sm">
                                            おすすめカテゴリ:
                                            {review.recommend_category}
                                        </p>
                                    )}

                                    <div className="mt-4">
                                        <p className="text-sm font-medium">
                                            おすすめ理由・レビュー
                                        </p>

                                        <p className="mt-2 text-sm leading-6 whitespace-pre-wrap text-muted-foreground">
                                            {review.comment ??
                                                'レビューはまだ投稿されていません。'}
                                        </p>
                                    </div>

                                    {review.is_hidden_by_admin && (
                                        <p className="mt-4 text-sm text-red-600">
                                            このレビューは管理者によって非表示にされています。
                                        </p>
                                    )}
                                </article>
                            )}
                        </>
                        )}
                    </section>
                )}
                {(!auth.user || !anime.user_anime_id  || activeTab === 'review') && (
                        <PublicReviewList
                            malId={anime.id}
                            publicReviews={publicReviews}
                        />
                )}
            </main>
        </>
    );
}
