import { usePage } from '@inertiajs/react';

import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

type AppLayoutPageProps = {
    flash?:{
        success?: string | null;
    };
};

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    const { flash } = usePage<AppLayoutPageProps>().props;

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            {flash?.success && (
                <div className="mx-6 mb-4 rounded-md border-green-200 bg-green-50 font-medium px-4 py-3 text-green-900 ">
                    {flash.success}
                </div>
            )}
            {children}
        </AppLayoutTemplate>
    );
}
