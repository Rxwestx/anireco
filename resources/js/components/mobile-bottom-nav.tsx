import { Link, usePage } from '@inertiajs/react';
import { Home, Search, Tag, LogIn, User, UserPlus,} from 'lucide-react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';


export function MobileBottomNav() {
    const { auth } = usePage().props;
    const  { isCurrentUrl } = useCurrentUrl();
    const getInitials = useInitials();


    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background min-[680px]:hidden">
            <div className="grid grid-cols-4">
                <Link
                    href="/dashboard"
                    className={`flex flex-col items-center justify-center gap-1 py-2  ${
                        isCurrentUrl('/dashboard') ? 'text-primary' : 'text-muted-foreground'
                    }`}
                >
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                </Link>

                <Link
                    href="/search"
                    className={`flex flex-col items-center justify-center gap-1 py-2  ${
                        isCurrentUrl('/search') ? 'text-primary' : 'text-muted-foreground'
                    }`}
                >
                    <Search className="h-5 w-5" />
                    <span>検索</span>
                </Link>

                <Link
                    href="/emotion-tags"
                    className={`flex flex-col items-center justify-center gap-1 py-2  ${
                        isCurrentUrl('/emotion-tags') ? 'text-primary' : 'text-muted-foreground'
                    }`}
                >
                    <Tag className="h-5 w-5" />
                    <span>感情タグ</span>
                </Link>

            {auth.user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                        type="button"
                        className ="flex flex-col items-center justify-center gap-1 py-2 text-muted-foreground"
                        >
                            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                <AvatarImage
                                    src={auth.user.avatar}
                                    alt={auth.user.name}
                                />
                                <AvatarFallback className="brounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                    {getInitials(auth.user.name)}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        side="top"
                        className="mb-2 min-w-56 rounded-lg"
                        >

                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="flex flex-col items-center justify-center gap-1 py-2 text-muted-foreground"
                        >
                            <User className="h-5 w-5" />
                            <span className="text-xs">
                                アカウント
                            </span>
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        side="top"
                        className="mb-2 min-w-48 rounded-lg"
                    >

                    <DropdownMenuItem asChild>
                        <Link
                            href="/login"
                            className="flex w-full cursor-pointer items-center"
                        >
                            <LogIn className="mr-2 h-4 w-4" />
                            ログイン
                        </Link>
                    </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link
                        href="/register"
                        className="flex w-full cursor-pointer items-center"
                    >
                        <UserPlus className="mr-2 h-4 w-4" />
                        新規登録
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        )}
        </div>
        </nav>
    );
}
