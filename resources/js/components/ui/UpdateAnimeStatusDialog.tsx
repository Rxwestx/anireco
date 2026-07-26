import { router } from '@inertiajs/react';
import { useState } from 'react';

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
                <Button type="button" variant="outline" className="w-full">
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
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="ステータスを選択" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="want_to_watch">
                            見たい
                        </SelectItem>

                        <SelectItem value="watching">
                            視聴中
                        </SelectItem>

                        <SelectItem value="completed">
                            視聴済み
                        </SelectItem>

                        <SelectItem value="dropped">
                            断念
                        </SelectItem>
                    </SelectContent>
                </Select>

                <DialogFooter>
                    <Button type="button" onClick={handleUpdate}>
                        変更する
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
