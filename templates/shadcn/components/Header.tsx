import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu } from "lucide-react";

export default function () {
    const t = useTranslations('saas_one.header');
    const navItems = (t.raw('nav.items') as any[]) || [];
    const buttons = (t.raw('buttons') as any[]) || [];
    const nav = t.raw('nav') as { items: any[] };
    
    const hasAvatar = t.raw('brand.avatar');
    const avatarSrc = hasAvatar ? t('brand.avatar.src') : '';
    const avatarTitle = hasAvatar ? t('brand.avatar.title') : '';

    const BrandContent = () => (
        hasAvatar ? (
            <div className="flex items-center gap-x-2 cursor-pointer">
                <img
                    src={avatarSrc}
                    alt={avatarTitle}
                    className="h-8"
                />
                <h1 className="text-xl font-bold">{t('brand.title')}</h1>
            </div>
        ) : (
            <h1 className="text-xl font-bold cursor-pointer">
                {t('brand.title')}
            </h1>
        )
    );

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto flex h-14 items-center px-4 sm:px-6 lg:px-8">
                <div className="mr-4 hidden md:flex">
                    <Link
                        href={t('brand.url') || ""}
                        className="text-lg font-medium mr-16"
                    >
                        <BrandContent />
                    </Link>

                    <nav className="flex items-center space-x-6 text-sm">
                        {navItems.map((v, idx) => (
                            <Link key={idx} href={v.url || ""} target={v.target || "_self"}>
                                {v.title}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-4 md:justify-end">
                    {buttons.map((v, idx) => (
                        <Link key={idx} href={v.url || ""} target={v.target || "_self"}>
                            <Button
                                key={idx}
                                size="sm"
                                variant={v.theme === "outline" ? "outline" : "default"}
                            >
                                {v.title}
                            </Button>
                        </Link>
                    ))}

                    <div className="md:hidden w-full flex items-center gap-x-2">
                        <Link
                            href={t('brand.url') || ""}
                            className="text-lg font-medium mr-16"
                        >
                            <BrandContent />
                        </Link>
                        <div className="flex-1"></div>

                        {nav.items && nav.items.length > 0 && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon" className="md:hidden">
                                        <Menu className="h-5 w-5" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {nav.items.map((v, idx) => (
                                        <DropdownMenuItem key={idx}>
                                            <Link
                                                href={v.url || ""}
                                                target={v.target || "_self"}
                                                className="w-full"
                                            >
                                                {v.title}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
