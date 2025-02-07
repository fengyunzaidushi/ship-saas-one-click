import { useTranslations } from "next-intl";
import Image from "next/image";


export default function () {
    const t = useTranslations('saas_one.footer');
    const navItems = (t.raw('nav.items') as any[]) || [];
    const socialItems = (t.raw('social.items') as any[]) || [];
    const brand = t.raw('brand') as any;


    return (
        <footer className="bg-background border-t">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-row flex-wrap justify-between gap-8">
                    {/* Brand Section */}
                    {brand.description && brand.title && (
                        <div className="flex-1 min-w-[240px] text-left">
                            {brand.avatar && (
                                <div className="relative group mb-6 transition-all duration-300 ease-in-out">
                                    <Image
                                        src="/static/images/logo-new.png"
                                        alt={brand.avatar.title}
                                        width={160}
                                        height={120}
                                        className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                                        priority
                                    />
                                </div>
                            )}
                            <h3 className="text-lg font-bold tracking-wide mb-4">{brand.title}</h3>
                            <div className="text-gray-600 leading-relaxed">{brand.description}</div>
                        </div>
                    )}

                    {navItems.map((v, idx) => {
                        return (
                            <div
                                className="flex-1 min-w-[200px] text-left"
                                key={idx}
                            >
                                <p className="uppercase mb-6 font-bold">{v.title}</p>
                                <ul className="mb-4">
                                    {v.children?.map((item, i) => {
                                        return (
                                            <li className="mt-2" key={i}>
                                                <a
                                                    href={item.url}
                                                    target={item.target}
                                                    className="hover:underline text-gray-600 hover:text-gray-800"
                                                >
                                                    {item.title}
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                </div>

                {/* Social Links */}
                {socialItems && (
                    <div className="flex justify-center mt-8 space-x-6">
                        {socialItems.map((v, idx) => {
                            return (
                                <a
                                    key={idx}
                                    href={v.url}
                                    target={v.target}
                                    rel="nofollow"
                                    className="text-gray-400 hover:text-gray-500 cursor-pointer"
                                >
                                    <span className="sr-only">{v.title}</span>
                                    {v.icon}
                                </a>
                            );
                        })}
                    </div>
                )}

                {/* Copyright */}
                <div className="mt-4 text-center">
                    <p className="text-base text-gray-400">{t('copyright')}</p>
                </div>
            </div>
        </footer>
    );
}
