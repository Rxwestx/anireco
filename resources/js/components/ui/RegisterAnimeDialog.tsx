import { router }  from '@inertiajs/react';
import { useState } from "react";
import { Check, Circle, Pause, Play, Square } from "lucide-react";

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
    const handleRegister = () => {
        router.post('/user-animes', {
            anime_id: anime.id,
            status: selectedStatus,
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedStatus('want_to_watch');
                    setOpen(true);
                }}
                className="mx-4 mb-4 w-[calc(100%-2rem)] rounded-md px-4 py-2 hover:bg-muted">
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
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="ステータスを選択" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="want_to_watch">
                            <span className="flex items-center gap-2">
                                <Circle className="size-4 fill-current" />
                                見たい
                            </span>
                        </SelectItem>
                        <SelectItem value="watching">
                            <span className="flex items-center gap-2">
                                <Play className="size-4 fill-current" />
                                視聴中
                            </span>
                        </SelectItem>
                        <SelectItem value="plan_to_watch">
                            <span className="flex items-center gap-2">
                                <Check className="size-4 fill-current" />
                                視聴済み
                            </span>
                        </SelectItem>
                        <SelectItem value="watched">
                            <span className="flex items-center gap-2">
                                <Square className="size-4 fill-current" />
                                断念
                            </span>
                        </SelectItem>
                    </SelectContent>
                </Select>

                <DialogFooter>
                    <button type="button" onClick={() => setOpen(false)}>
                        閉じる
                    </button>
                    <button type="button" onClick={handleRegister}>
                        登録
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
