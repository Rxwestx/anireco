import { Head, Link,router,usePage } from '@inertiajs/react';
import type { SubmitEventHandler } from 'react';
import { useState } from 'react';
import SeasonalAnimeCard from '@/components/animes/SeasonalAnimeCard';
import { Input } from '@/components/ui/input';
import RegisterAnimeDialog from '@/components/ui/RegisterAnimeDialog';
import UpdateAnimeStatusDialog from '@/components/ui/UpdateAnimeStatusDialog';
import type { Auth } from '@/types';

type WatchingStatus =
        | 'want_to_watch'
        | 'watching'
        | 'completed'
        | 'dropped';

type Anime = {
        id: number;
        title: string;
        main_picture: {
            medium: string;
            large: string;
        } | null;
        start_date: string | null;
        genres: {
            id: number;
            name: string;
        }[];
        user_anime_id: number | null;
        registered_status: WatchingStatus | null;
};

type SearchProps = {
    keyword: string;
    animes: Anime[];
    seasonalAnime: Anime[];
    seasonYear: number;
    seasonLabel: string;
    searchApiError?: string | null;
    seasonalApiError?: string | null;
    searchPage: number;
    searchTotal: number;
    searchTotalPages: number;
};

// Laravel側から受け取った keywordを初期値として設定するために、propsでinitialKeywordとして受け取る。
export default function Search({
    keyword: initialKeyword,
    animes,
    seasonalAnime,
    seasonYear,
    seasonLabel,
    searchApiError = null,
    seasonalApiError = null,
    searchPage,
    searchTotal,
    searchTotalPages,

}: SearchProps) {

    const [keyword, setKeyword] = useState(initialKeyword);

    const [seasonPage, setSeasonPage] = useState(1);

    const seasonalAnimePerPage = 20;

    const seasonalAnimeTotalPages = Math.ceil(
            seasonalAnime.length / seasonalAnimePerPage,
    );

    const displayedSeasonalAnime = seasonalAnime.slice(
            (seasonPage - 1) * seasonalAnimePerPage,
            seasonPage * seasonalAnimePerPage,
    );

    const { auth } = usePage<{ auth: Auth }>().props;
    // 検索結果のアニメリストを格納する配列

    const handleSearch: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        // 検索処理を実装する
        router.get('/search', {
            keyword
        });
    };

    const handleSeasonPageChange = (page: number) => {
        setSeasonPage(page);

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    const handleSearchPageChange = (page: number) => {
        router.get(
            '/search',
            {
                keyword: initialKeyword,
                page,
            },
            {
                onSuccess: () => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                    });
                },
            },
        );
    };

    return (
        <>
            <Head title="アニメ検索" />

                <div className="w-full px-4 min-[680px]:px-6 min-[1100px]:px-8">
                    <form onSubmit={handleSearch} className="mt-4 flex flex-col gap-2">
                        <section>
                            <h1 className="text-2xl font-bold">アニメ検索</h1>
                            <div className="flex flex-col gap-2 min-[680px]:flex-row min-[680px]:items-center">
                                <Input
                                    type="text"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    placeholder="作品タイトルで検索"
                                />
                                <button type="submit"
                                className="shrink-0 cursor-pointer rounded-md bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-700 min-[680px]:w-auto">
                                    検索
                                </button>
                            </div>
                        </section>
                    </form>
                    {initialKeyword !== '' && (
                        <section className="mt-8">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="mb-4 text-xl font-semibold">
                                    検索結果：{searchTotal}件
                                </h2>
                            </div>
                            {searchApiError ? (
                                <div className="rounded-xl border p-6">
                                    <p className="text-sm text-muted-foreground">
                                        {searchApiError}
                                    </p>
                                </div>
                            ) : animes.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-2 gap-4 min-[680px]:grid-cols-3 min-[1100px]:grid-cols-5
                                    ">
                                        {animes.map(anime => (
                                        <article
                                            key={anime.id}
                                            className="group flex h-full flex-col overflow-hidden rounded-xl border bg-background transition hover:-translate-y-1 hover:shadow-lg">
                                                <Link
                                                    href={`/animes/${anime.id}?keyword=${encodeURIComponent(initialKeyword)}`}
                                                    className="flex flex-1 flex-col focus:outline-none focus:ring-2 focus:ring-ring"
                                                >
                                                    <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
                                                            {anime.main_picture ? (
                                                                <img
                                                                    src={
                                                                        anime.main_picture.large ??
                                                                        anime.main_picture.medium
                                                                    }
                                                                    alt={anime.title
                                                                    }
                                                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                                                'No Image'
                                                                </div>
                                                            )}
                                                    </div>
                                                    <div className="p-3 space-y-2 min-[680px]:p-4">
                                                        <h3 className="text-sm font-semibold min-[680px]:text-lg">
                                                            {anime.title}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            放送年：{anime.start_date ?? '未定'}
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {anime.genres.length > 0 ? (
                                                                anime.genres.map((genre) => (
                                                                    <span
                                                                        key={genre.id}
                                                                        className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
                                                                    >
                                                                        {genre.name}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-xs text-muted-foreground">ジャンル情報なし</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Link>
                                                <div className="mt-auto flex min-h-14 items-end justify-center p-4 pt-0">
                                                    <div className="flex w-full justify-center">
                                                        {!auth.user ? (
                                                            <Link
                                                                href="/login"
                                                                className="block w-full rounded-md px-4 py-2 text-sm text-center font-medium hover:bg-muted">
                                                                    +登録する
                                                            </Link>
                                                        ) : anime.registered_status && anime.user_anime_id ? (
                                                            <UpdateAnimeStatusDialog
                                                                userAnimeId={anime.user_anime_id}
                                                                currentStatus={anime.registered_status}
                                                            />
                                                        ) : (
                                                            <RegisterAnimeDialog anime={anime} />
                                                        )}
                                                    </div>
                                                </div>
                                        </article>
                                        ))}
                                    </div>

                                {searchTotalPages > 1 && (
                                    <div className="mt-8 flex justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSearchPageChange(
                                                    Math.max(searchPage - 1, 1),
                                                )
                                            }
                                            disabled={searchPage === 1}
                                            className="cursor-pointer rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            前へ
                                        </button>

                                        {Array.from(
                                            { length: searchTotalPages },
                                            (_, index) => index + 1,
                                        ).map((page) => (
                                        <button
                                        key={page}
                                            type="button"
                                            onClick={() =>
                                                handleSearchPageChange(page)
                                            }
                                            className={`cursor-pointer rounded-md border px-3 py-2 text-sm ${
                                                searchPage === page
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'text-foreground hover:bg-muted'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSearchPageChange(
                                                    Math.min(
                                                        searchPage + 1,
                                                        searchTotalPages,
                                                    ),
                                                )
                                            }
                                            disabled={searchPage === searchTotalPages}
                                            className="cursor-pointer rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            次へ
                                        </button>
                                    </div>
                                )}
                                </>
                            ) : (
                                <p className="text-muted-foreground">
                                検索結果はありません。
                                </p>
                            )}
                        </section>
                    )}

                    {initialKeyword === '' && (
                        <section className="mt-12">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-semibold">
                                    {seasonYear}年 {seasonLabel}アニメ
                                </h2>
                            </div>

                            {seasonalApiError ? (
                                <div className="rounded-xl border p-6">
                                    <p className="text-sm text-muted-foreground">
                                        {seasonalApiError}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-4 min-[680px]:grid-cols-3 min-[1100px]:grid-cols-5">
                                        {displayedSeasonalAnime.map(anime => (
                                            <SeasonalAnimeCard
                                                key={anime.id}
                                                anime={anime}
                                            />
                                        ))}
                                    </div>

                                    {seasonalAnimeTotalPages > 1 && (
                                        <div className="mt-8 flex flex-wrap justify-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleSeasonPageChange(Math.max(seasonPage - 1, 1))}
                                                disabled={seasonPage === 1}
                                                className="rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                前へ
                                            </button>

                                        {Array.from(
                                            { length: seasonalAnimeTotalPages },
                                            (_, index) => index + 1,
                                            ).map((page) => (
                                                <button
                                                    key={page}
                                                    type="button"
                                                    onClick={() => {
                                                        handleSeasonPageChange(page);
                                                    }}
                                                    className={`rounded-md border px-3 py-2 text-sm ${
                                                        seasonPage === page
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'hover:bg-muted text-foreground'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleSeasonPageChange(
                                                        Math.min(seasonPage + 1, seasonalAnimeTotalPages),
                                                    )
                                                }
                                                disabled={seasonPage === seasonalAnimeTotalPages}
                                                className="rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                次へ
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </section>
                    )}
                </div>
        </>
    );
}
