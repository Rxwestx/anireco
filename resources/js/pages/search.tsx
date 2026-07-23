import { Head, Link,router } from '@inertiajs/react';

import type { SubmitEventHandler } from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import RegisterAnimeDialog from '@/components/ui/RegisterAnimeDialog';



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
};

type SearchProps = {
    keyword: string;
    animes: Anime[];
};

// Laravel側から受け取った keywordを初期値として設定するために、propsでinitialKeywordとして受け取る。
export default function Search({
    keyword: initialKeyword,
    animes,
}: SearchProps) {

    const [keyword, setKeyword] = useState(initialKeyword);

    // 検索結果のアニメリストを格納する配列

    const handleSearch: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        // 検索処理を実装する
        router.get('/search', {
            keyword
        });
    };

    return (
        <>
            <Head title="アニメ検索" />

            <form onSubmit={handleSearch} className="mt-4 flex flex-col gap-2">
                <section>
                    <h1 className="text-2xl font-bold">アニメ検索</h1>

                    <Input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="作品タイトルで検索"
                    />
                    <button type="submit"
                    className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        検索
                    </button>
                </section>
            </form>
            {initialKeyword !== '' && (
                <section className="mt-8">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="mb-4 text-xl font-semibold">
                            検索結果：{animes.length}件
                        </h2>
                    </div>
                        {animes.length > 0 ? (
                            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                                {animes.map(anime => (
                                <article
                                    key={anime.id}
                                    className="group block overflow-hidden rounded-xl border bg-background transition hover:-translate-y-1 hover:shadow-lg">
                                        <Link
                                            href={`/animes/${anime.id}`}
                                            className="block focus:outline-none focus:ring-2 focus:ring-ring"
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
                                            <div className="space-y-2 p-4">
                                                <h3 className="text-lg font-semibold">
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
                                    <RegisterAnimeDialog anime={anime} />
                                </article>
                                ))}
                        </div>
                        ) : (
                            <p className="text-muted-foreground">
                            検索結果はありません。
                            </p>
                        )}
                </section>
            )}
        </>
    );
}

// Search.layout = {
//     breadcrumbs: [
//         {
//             title: '検索',
//             href: search(),
//         },
//     ],
// // };

