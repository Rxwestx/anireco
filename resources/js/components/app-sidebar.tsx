import { Link, usePage } from '@inertiajs/react';
import {
    Home,
    Search, Tag
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
// import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

type AuthUser ={
    id: number;
    name: string;
    email: string;
};

type PageProps ={
    auth: {
        user: AuthUser | null;
    };
}


export function AppSidebar() {
    const { auth } = usePage<PageProps>().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Home',
            href: auth.user ? '/dashboard' : '/',
            icon: Home,
        },
        {
            title: '検索',
            href: '/search',
            icon: Search,
        },
        {
            title: '感情タグ',
            href: '/emotion-tags',
            icon: Tag,
        },
    ];

// const footerNavItems: NavItem[] = [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={auth.user ? '/dashboard' : '/'} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                {auth.user ? (
                <NavUser user={auth.user} />
                ) : (
                <div className="flex flex-col gap-2 p-2">
                    <Link
                        href="/register"
                        className="w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        新規登録
                    </Link>
                    <Link
                        href="/login"
                        className="w-full items-center justify-center rounded-full bg-secondary px-4 py-2.5 text-center text-sm font-medium text-secondary-foreground shadow-sm hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        ログイン
                    </Link>
                </div>
                )}

            </SidebarFooter>
        </Sidebar>
    );
}
