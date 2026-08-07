import { Head, Link, usePage } from '@inertiajs/react';
import SeasonalAnimeCard from '@/components/animes/SeasonalAnimeCard';
import type { SeasonalAnime } from '@/components/animes/SeasonalAnimeCard';
import { dashboard, login,register } from '@/routes';

type WelcomeProps = {
    seasonalAnime: SeasonalAnime[];
    seasonYear: number;
    seasonLabel: string;
};

export default function Welcome({
    seasonalAnime,
    seasonYear,
    seasonLabel
}: WelcomeProps) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Anireco" />

            <main className="min-h-screen bg-white text-gray-900">
                <section className="flex flex-col items-center justify-center gap-6 border border-[#e5e5e5] bg-[#f5f5f5]px-20 py-20 text-center">
                    <h1 className="text-5xl font-bold">
                        あなたのオタクライフを、
                        <span className="text-[#666]">
                            ログ
                        </span>
                        に残そう。
                    </h1>

                    <p className="w-[600px] text-lg text-[#666]">
                        視聴したアニメの感想、感情タグ、評価を記録。
                        自分だけのアニメログを作成して、
                        オタクライフをより充実させましょう。
                    </p>

                    <div className="flex gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()
}                               className="cursor-pointer rounded-lg  bg-black px-8 py-4 text-lg font-semibold text-white px-6 py-3 text-white"
                            >
                                マイページへ
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={register()}
                                    className="cursor-pointer rounded-lg bg-black px-8 py-4 text-lg font-semibold text-white"
                                >
                                    新規登録
                                </Link>

                                <Link
                                    href={login()}
                                    className="cursor-pointer rounded-lg bg-black px-8 py-4 text-lg font-semibold text-white"
                                >
                                    ログイン
                                </Link>
                            </>
                        )}
                    </div>
                </section>

                <section className="px-20 py-20">
                    <div className="flex item-center justify-between">
                        <h2 className="text-2xl font-bold">
                            {seasonYear}年 {seasonLabel}アニメ
                        </h2>

                        <button
                            type="button"
                            className="text-sm font-semibold underline"
                        >
                            もっと見る
                        </button>
                    </div>
                    <div className="mt-10 grid grid-cols-5 gap-6">
                        {seasonalAnime.map((anime) => (
                            <SeasonalAnimeCard
                                key={anime.id}
                                anime={anime}
                            />
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
}
