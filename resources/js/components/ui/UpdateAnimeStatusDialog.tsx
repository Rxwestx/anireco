import { router } from '@inertiajs/react';
import { useState } from 'react';

import { Check, Circle, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';


type WatchingStatus =
    | "want_to_watch"
    | "watching"
    | "completed"
    | "dropped";

type UpdateAnimeStatusDialogProps = {
    userAnimeId: number;
    currentStatus: WatchingStatus;
    triggerClassName?: string;
};

const statusLabels: Record<WatchingStatus, string> = {
    want_to_watch: "見たい",
    watching: "視聴中",
    completed: "視聴済み",
    dropped: "断念",
};

export default function UpdateAnimeStatusDialog({
    userAnimeId,
    currentStatus,
    triggerClassName,
}: UpdateAnimeStatusDialogProps) {
    const [open, setOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] =
        useState<WatchingStatus>(currentStatus);

    const handleUpdate = () => {
        router.patch(
            `/user-animes/${userAnimeId}`,
            {
                status: selectedStatus,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setOpen(false);
                },
            },
        );
    };
    return (
        <Dialog
        open={open}
        onOpenChange={(isOpen) =>{
            setOpen(isOpen);

            if(isOpen){
                setSelectedStatus(currentStatus);
            }
        }}
        >
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className={
                        triggerClassName ??
                        "w-full cursor-pointer"}
                        >
                    {statusLabels[currentStatus]}
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>ステータスを更新</DialogTitle>
                </DialogHeader>

                <Select
                    value={selectedStatus}
                    onValueChange={(value: WatchingStatus) => {
                        setSelectedStatus(value);
                    }}
                >
                    <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="ステータスを選択" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="want_to_watch"className="cursor-pointer">
                            <span className="flex items-center gap-2">
                                <Circle className="size-4 fill-current" />
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
                <DialogFooter>
                    <Button type="button" onClick={handleUpdate} className="cursor-pointer">
                        変更する
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
