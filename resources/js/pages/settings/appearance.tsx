import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    return (
        <>
            <Head title="テーマ設定" />
        
            <h1 className="sr-only">外観設定</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="テーマ設定"
                    description="表示テーマを更新できます"
                />
                <AppearanceTabs />
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'テーマ設定',
            href: editAppearance(),
        },
    ],
};
