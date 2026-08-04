import { Link } from '@inertiajs/react';

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginationProps = {
    links: PaginationLink[];
    lastPage: number;
    ariaLabel?: string;
};

export default function Pagination( {
    links,
    lastPage,
    ariaLabel = 'ページ移動',
}: PaginationProps) {
    if (lastPage <= 1) {
        return null;
    }

    return (
        <nav
            className="mt-8 flex flex-wrap justify-center gap-2"
            aria-label={ariaLabel}
        >
            {links.map((link, index) => {
                const label = link.label
                    .replace(/&laquo;/g, '≪')
                    .replace(/&raquo;/g, '≫')
                    .replace('Previous', '前へ')
                    .replace('Next', '次へ');

                if (link.url === null) {
                    return (
                        <span
                            key={`${link.label}-${index}`}
                            className="rounded-md border px-3 py-2 text-sm text-muted-foreground opacity-50"
                        >
                            {label}
                        </span>
                    );
                }

                return (
                    <Link
                        key={`${link.label}-${index}`}
                        href={link.url}
                        preserveScroll
                        className={`rounded-md border px-3 py-2 text-sm ${
                            link.active
                                ? 'bg-foreground text-background'
                                : 'hover:bg-muted'
                        }`}
                    >
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}

