import { Head, router } from '@inertiajs/react';

import type { SubmitEventHandler } from 'react';
import { useState } from 'react';


import { Input } from '@/components/ui/input';



type Anime = {
        node:{
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
};

type SearchProps = {
    keyword: string;
    animes: Anime[];
};

// Laravel側から受け取った keywordを初期値として設定するために、propsでinitialKeywordとして受け取る。
export default function Search({
    keyword: initialKeyword,
    animes,
}: SearchProps)

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
            {keyword !== '' && (
                <section className="mt-8">
                        <h2 className="mb-4 text-xl font-semibold">
                            検索結果
                        </h2>
                        {animes.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2">
                                {animes.map(anime => (
                                <article
                                    key={anime.id}
                                    className="rounded-xl border p-4"
                                    >
                                    <div className="flex gap-4">
                                            <div className="flex h-28 w-20 items-center justify-center rounded-lg bg-muted">
                                                {anime.node.main_picture ? (
                                                    <img
                                                        src={anime.node.main_picture.medium}
                                                        alt={anime.node.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    'No Image'
                                                )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold">{anime.node.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                放送年：{anime.node.start_date}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                ジャンル：{anime.node.genre}
                                            </p>
                                            <button className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                                                登録
                                            </button>
                                        </div>
                                    </div>
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
