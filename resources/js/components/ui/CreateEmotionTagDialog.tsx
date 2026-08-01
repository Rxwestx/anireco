import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';

type CreateEmotionTagDialogProps = {
    buttonLabel: string;
    buttonClassName?: string;
};

export default function CreateEmotionTagDialog({
    buttonLabel = '+ 新しい感情タグを作る',
    buttonClassName ='cursor-pointer rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted',
}: CreateEmotionTagDialogProps) {
    const [open, setOpen] = useState(false);

    const form = useForm({
        name: '',
    });

    const handleOpen = () => {
        form.reset();
        form.clearErrors();
        setOpen(true);
    };

    const handleClose = () => {
        if (form.processing) {
            return;
        }
        setOpen(false);
        form.reset();
        form.clearErrors();
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        form.post('/emotion-tags', {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                form.reset();
                form.clearErrors();
            },
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (nextOpen) {
                    handleOpen();
                return;
                }
                handleClose();
            }}
        >

        <button
            type="button"
            onClick={handleOpen}
            className={buttonClassName}
        >
            {buttonLabel}
        </button>

        <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>
                        新しい感情タグを追加
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-6">
                    <label
                    htmlFor="emotion-tag-name"
                    className="mb-2 block text-sm font-medium"
                    >
                        タグ名
                        <span className="ml-1 text-red-600">
                            *
                        </span>
                    </label>
                    <input
                    id="emotion-tag-name"
                    type="text"
                    value={form.data.name}
                    onChange={(e) =>
                        form.setData('name', e.target.value)
                    }
                    maxLength={50}
                    autoFocus
                    placeholder="例：泣ける"
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <div className="mt-1 flex items-start justify-between gap-4">
                        <div>
                            {form.errors.name && (
                                <p className="text-sm text-red-600">
                                    {form.errors.name}
                                </p>
                            )}
                        </div>

                        <p className="text-xs text-muted-foreground">
                            {form.data.name.length}/50
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={form.processing}
                        className="cursor-pointer rounded-md border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        キャンセル
                    </button>
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {form.processing
                        ? '登録中...'
                        : '作成'}
                    </button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
    );
}
