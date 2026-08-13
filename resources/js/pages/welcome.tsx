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

            <main className="min-h-screen">
                <section className="flex flex-col items-center justify-center gap-6 border border-[#e5e5e5] px-4 py-16 text-center min-[680px]:px-20 min-[680px]:py-20">
                    <h1 className="text-3xl font-bold leading-tight min-[680px]:text-5xl">
                        あなたのオタクライフを、
                        <span className="text-[#666]">
                            ログ
                        </span>
                        に残そう。
                    </h1>

                    <p className="w-full max-w-[600px] text-base text-[#666] min-680px]:text-lg">
                        視聴したアニメの感想、感情タグ、評価を記録。
                        自分だけのアニメログを作成して、
                        オタクライフをより充実させましょう。
                    </p>

                    <div className="flex w-full max-w-sm flex-col gap-3 min-[680px]:w-auto min-[680px]:max-w-none min-[680px]:flex-row min-[680px]:gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="cursor-pointer rounded-lg bg-primary px-8 py-4 text-center text-base font-semibold text-primary-foreground transition hover:bg-primary/90 min-[680px]:text-lg"
                            >
                                マイページへ
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={register()}
                                    className="cursor-pointer rounded-lg bg-primary px-8 py-4 text-center text-base font-semibold text-primary-foreground transition hover:bg-primary/90 min-[680px]:text-lg"
                                >
                                    新規登録
                                </Link>

                                <Link
                                    href={login()}
                                    className="cursor-pointer rounded-lg bg-primary px-8 py-4 text-center text-base font-semibold text-primary-foreground transition hover:bg-primary/90 min-[680px]:text-lg"
                                >
                                    ログイン
                                </Link>
                            </>
                        )}
                    </div>
                </section>

                <section className="px-4 py-12 min-[680px]:px-20 min-[680px]:py-20">
                    <div className="flex item-center justify-between">
                        <h2 className="text-2xl font-bold">
                            {seasonYear}年 {seasonLabel}アニメ
                        </h2>

                        <Link
                            href="/search"
                            className="text-sm underline"
                        >
                            もっと見る
                        </Link>
                    </div>
                    <div className="mt-10 grid grid-cols-2 gap-4 min-[680px]:grid-cols-3 min-[1100px]:grid-cols-5 min-[1100px]:gap-6">
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
