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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
