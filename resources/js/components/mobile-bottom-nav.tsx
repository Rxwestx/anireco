import { Link, usePage } from '@inertiajs/react';
import { Home, Search, Tag, User } from 'lucide-react';
import { use } from 'react';

export function MobileBottomNav() {
    const { auth } = usePage().props;

    if(!auth.user) {
        return null;
    }

    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background md:hidden">
            <div className="grid grid-cols-3">
                <Link
                    href="/dashboard"
                    className="flex flex-col items-center justify-center gap-1 py-2 text-xs"
                >
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                </Link>        
            
                <Link
                    href="/search"
                    className="flex flex-col items-center justify-center gap-1 py-2 text-xs"
                >
                    <Search className="h-5 w-5" />
                    <span>検索</span>
                </Link>

                <Link
                    href="/emotion-tags"
                    className="flex flex-col items-center justify-center gap-1 py-2 text-xs"
                >
                    <Tag className="h-5 w-5" />
                    <span>感情タグ</span>
                </Link>
            </div>
        </nav>            
    );
}
