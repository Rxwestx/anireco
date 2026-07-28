import { Head, useForm } from "@inertiajs/react";
import type { FormEvent } from "react";


type EmotionTag = {
    id: number;
    name: string;
    created_at: string;
};

type EmotionTagsIndexProps = {
    emotionTags: EmotionTag[];
};

export default function EmotionTagsIndex({
    emotionTags,
}: EmotionTagsIndexProps) {
    const {
            data,
            setData,
            post,
            processing,
            errors,
            riset,
    } = useForm({
        name: "",
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post("emotion-tags", {
            preserveScroll: true,
            onSuccess: () => reset("name"),
        });
    };

    return (
        <>
            <Head title="感情タグ管理" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <section>
                    <h1 className="text-2xl font-bold">
                        感情タグ
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        アニメを視聴し、自分の感じた感想を表すタグを管理することができます。
                    </p>
                </section>
                <section>
                    <h2 className="mb-4 text-xl font-semibold">
                        新しい感情タグを追加
                    </h2>
                    <form onSubmit={handleSubmit} className="max-w-md space-y-3">
                        <div>
                            <label htmlFor="name" className="mb-2 block text-sm font-medium">
                                タグ名
                            </label>

                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="新しい感情タグを追加 例：感動した"
                                className="w-full rounded-md border bg-ground px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                            />
                        {errors.name &&(
                            <p className="mt-1 text-sm text-red-600">
                                {errors.name}
                            </p>
                        )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? "登録中..." : "登録する"}
                        </button>
                    </form>
                </section>
                <section>
                    <h2 className="mb-4 text-xl font-semibold">
                        感情タグ一覧
                    </h2>
                    {emotionTags.length === 0 ? (
                    <div className="rounded-xl border p-6">
                        <p className="text-muted-foreground">
                            感情タグはまだ登録されていません。
                        </p>
                    </div>
                    ) : (
                        <div className="flex flex-wrap gap-3">
                            {emotionTags.map((emotionTag) => (
                                <div
                                    key={emotionTag.id}
                                    className="rounded-full border px-4 py-2 text-sm"
                                    >
                                    {emotionTag.name}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
