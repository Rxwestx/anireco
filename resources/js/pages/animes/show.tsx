import { Head } from '@inertiajs/react';

type Anime = {
    id: number;
    title: string;
    main_picture?: {
        medium: string;
        large: string;
    } ;
    start_date?: string;
    synopsis?: string;
    genres?: {
        id: number;
        name: string;
    }[];
};

type ShowProps = {
    anime: Anime;
};

export default function Show({ anime }: ShowProps) {
    return (
        <>
            <Head title={anime.title} />

           <main className="mx-auto w-full max-w-6xl px-4 py-8">
                <div className="grid gap-8 md:grid-cols-[280px_1fr]">
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
                        <h1 className="text-3xl font-bold">
                            {anime.title}
                        </h1>
                        <div className="mt-4 space-y-3">
                            <p className="text-sm text-muted-foreground">
                                {anime.start_date ?? '放送年未定'}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {anime.genres && anime.genres.length > 0 ?(
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
                                <h2 className="text-2xl font-bold">
                                    あらすじ
                                </h2>
                                <p className="mt-3 whitespace-pre-line leading-7 text-muted-foreground">
                                    {anime.synopsis ?? 'あらすじ未定'}
                                </p>
                            </div>
                    </section>
                </div>
            </main>
        </>
    );
}
