import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <div className="hidden min-[680px]:block">
                <AppSidebar />
            </div>

            <AppContent
                variant="sidebar"
                className="overflow-x-hidden pb-20 min-[680px]:pb-0">
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    {children}
            </AppContent>
            <MobileBottomNav />
        </AppShell>
    );
}
