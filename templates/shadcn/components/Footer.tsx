import { useTranslations } from "next-intl";


export default function () {
    const t = useTranslations('saas_one.footer');
    const navItems = (t.raw('nav.items') as any[]) || [];
    const socialItems = (t.raw('social.items') as any[]) || [];
    

    return (
        <footer className="bg-background border-t">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-row flex-wrap justify-between gap-8">
                    {/* Newsletter */}
                    {t('brand.description') && t('brand.title') && (
                        <div className="flex-1 min-w-[200px] text-left">
                            <p className="uppercase mb-6 font-bold">{t('brand.title')}</p>
                            <div className="flex flex-col">{t('brand.description')}</div>
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
