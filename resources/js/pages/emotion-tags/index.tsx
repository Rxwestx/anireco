import emotionTags from "@/routes/emotion-tags";
import { Head } from "@inertiajs/react";
import { useState } from "react";

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
