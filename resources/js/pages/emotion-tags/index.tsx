import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import type { SubmitEvent } from "react";


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

    const [editingTagId, setEditingTagId] = useState<number | null>(null);

    const {
            data,
            setData,
            post,
            processing,
            errors,
            reset,
    } = useForm({
        name: "",
    });

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        post("emotion-tags", {
            preserveScroll: true,
            onSuccess: () => reset("name"),
        });
    };

        const editForm = useForm({
        name: "",
    });

    const startEditing = (emotionTag: EmotionTag) => {
        setEditingTagId(emotionTag.id);
        editForm.setData("name", emotionTag.name);
        editForm.clearErrors();
    };

    const cancelEditing = () => {
        setEditingTagId(null);
        editForm.reset();
        editForm.clearErrors();
    };

    const handleUpdate = (e: SubmitEvent<HTMLFormElement>,
        emotionTagId: number,
    ) => {
        e.preventDefault();

        editForm.patch(`/emotion-tags/${emotionTagId}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingTagId(null);
                editForm.reset('name');
                editForm.clearErrors();
            },
        });
    }

    const handleDelete = (emotionTag: EmotionTag) => {
        const shouldDelete = window.confirm(
            `本当に「${emotionTag.name}」を削除しますか？`,
        );
        
        if (shouldDelete) {
            // 削除処理をここに追加
            editForm.delete(`/emotion-tags/${emotionTag.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingTagId(null);
                    editForm.reset('name');
                    editForm.clearErrors();
                },
            });
        }
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
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
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
                            className="w-full cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 min-[680px]:w-auto"
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
                                <div key={emotionTag.id}>
                                    {editingTagId === emotionTag.id ? (
                                        <form
                                            onSubmit={(e) =>
                                                handleUpdate(e, emotionTag.id)
                                            }
                                            className="flex w-full flex-col gap-2 rounded-lg border p-3 min-[680px]:flex-row min-[680px]:flex-wrap min-[680px]:items-start"
                                        >
                                            <div>
                                                <input
                                                    type="text"
                                                    value={editForm.data.name}
                                                    onChange={(e) => editForm.setData(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                    className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                                                />
                                                {editForm.errors.name && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {editForm.errors.name}
                                                    </p>
                                                )}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={editForm.processing}
                                                className="cursor-pointer rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {editForm.processing ?
                                                    "更新中..."
                                                    : "保存"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={cancelEditing}
                                                className="cursor-pointer rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                キャンセル
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
                                            <span>{emotionTag.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => startEditing(emotionTag)}
                                                aria-label="感情タグを編集"
                                                title="編集"
                                                className="cursor-pointer text-muted-foreground transition hover:text-foreground"
                                            >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="size-4"
                                                aria-hidden="true"
                                            >
                                                <path d="M12 20h9" />
                                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                            </svg>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(emotionTag)}
                                                className="cursor-pointer transition text-red-600"
                                                aria-label="感情タグを削除"
                                                title="削除"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="2"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="size-4"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M3 6h18" />
                                                    <path d="M8 6V4h8v2" />
                                                    <path d="M19 6l-1 14H6L5 6" />
                                                    <path d="M10 11v5" />
                                                    <path d="M14 11v5" />
                                                </svg>
                                            </button>
                                        </div>

                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
