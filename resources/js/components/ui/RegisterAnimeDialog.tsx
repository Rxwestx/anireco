import { router } from '@inertiajs/react';
import { useState } from "react";
import { Check, Circle, Play, Square } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

type Anime = {
    id: number;
    title: string;}

type RegisterAnimeDialogProps = {
    anime: Anime;
};

export default function RegisterAnimeDialog({
    anime,
}: RegisterAnimeDialogProps) {
    const [open, setOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("want_to_watch");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleRegister = () => {
        router.post(
            '/user-animes',
            {
                anime_id: anime.id,
                status: selectedStatus,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setOpen(false);
                },
                onError: (errors) => {
                    setErrorMessage(
                        typeof errors.anime === 'string'
                        ? errors.anime
                        : "エラーが発生しました",
                    );
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedStatus('want_to_watch');
                    setErrorMessage(null);
                    setOpen(true);
                }}
                className="h-10 w-full rounded-md px-4 py-2 cursor-pointer hover:bg-muted">
                    +登録する
            </button>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>アニメを登録</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    ステータスを選択
                </p>
                <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="ステータスを選択" />
                    </SelectTrigger>

                    <SelectContent >
                        <SelectItem value="want_to_watch"className="cursor-pointer">
                            <span className="flex items-center gap-2">
                                <Circle className="size-4 fill-current hover:cursor-pointer" />
                                見たい
                            </span>
                        </SelectItem>
                        <SelectItem value="watching" className="cursor-pointer">
                            <span className="flex items-center gap-2">
                                <Play className="size-4 fill-current" />
                                視聴中
                            </span>
                        </SelectItem>
                        <SelectItem value="completed" className="cursor-pointer">
                            <span className="flex items-center gap-2">
                                <Check className="size-4 fill-current" />
                                視聴済み
                            </span>
                        </SelectItem>
                        <SelectItem value="dropped" className="cursor-pointer">
                            <span className="flex items-center gap-2">
                                <Square className="size-4 fill-current" />
                                断念
                            </span>
                        </SelectItem>
                    </SelectContent>
                </Select>

                {errorMessage && (
                    <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {errorMessage}
                    </p>
                )}

                <DialogFooter>
                    <button type="button" onClick={() => setOpen(false)} className="cursor-pointer">
                        閉じる
                    </button>
                    <button type="button" onClick={handleRegister} className="cursor-pointer">
                        登録
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
