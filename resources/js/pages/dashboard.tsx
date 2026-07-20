import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';

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
    statuslabel: string;
    created_at: string | null;
    anime_master: AnimeMaster;
};

type DashboardProps = {
    userAnimes: UserAnime[];
    recentlyAdded: UserAnime[];
};

export default function Dashboard({
    userAnimes,
    recentlyAdded,
 }: DashboardProps) {
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
                {userAnimes.length === 0 ? (
                    <div className="rounded-xl border p-6">
                        <p className="text-muted-foreground">
                        登録したアニメはありません。
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                            {userAnimes.map((userAnime) => (
                                <article
                                 key={userAnime.id}
                                className="rounded-xl border p-4">
                                    {userAnime.anime_master.cover_image ? (
                                        <img
                                            src={userAnime.anime_master.cover_image}
                                            alt={userAnime.anime_master.title}
                                            className="aspect-[3/4] w-full rounded-lg object-cover"
                                        />

                                    ) : (
                                        <div className="flex aspect-[3/4] items-center justify-center rounded-lg bg-muted-foreground">
                                            <span className="text-sm text-muted-foreground">No Image</span>
                                        </div>
                                    )}
                                    <div className="mt-4">
                                    <h3 className="text-lg font-semibold">
                                        {userAnime.anime_master.title}
                                    </h3>
                                    <p className="m-1 text-sm text-muted-foreground">
                                        {userAnime.statuslabel}</p>
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
