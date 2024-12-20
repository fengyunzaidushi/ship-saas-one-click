import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Hero() {
    const t = useTranslations('saas_one.hero');
    const buttons = t.raw('buttons');
    const hasImage = t.raw('image');

    // 确保buttons是数组
    const validButtons = Array.isArray(buttons) ? buttons : [];

    return (
        <div className="bg-gradient-to-t from-zinc-50 to-white dark:from-zinc-950 dark:to-black relative">
            <div className="absolute bg-[url('/_convertfast/gradient-bg-0.svg')] bg-auto bg-no-repeat z-0 inset-0 top-0 bottom-0 left-0 right-0 grayscale"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-5xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-6 drop-shadow-md">
                        {t('title')}
                    </h2>
                    <p className="text-xl sm:text-2xl text-muted-foreground mb-8">
                        {t('description')}
                    </p>
                    {validButtons.length > 0 && (
                        <div className="flex flex-row justify-center gap-4">
                            {validButtons.map((v, idx) => (
                                <Link key={idx} href={v.url || ""} target={"_self"}>
                                    <Button
                                        key={idx}
                                        size="lg"
                                        variant={v.theme === "outline" ? "outline" : "default"}
                                    >
                                        {v.title}
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    )}
                    {t("tip") && <p className="mt-4 text-sm text-gray-500">{t('tip')}</p>}
                </div>

                {hasImage && (
                    <img
                        alt={t('image.title')}
                        src={t('image.src')}
                        className="mt-8 max-w-full md:max-w-5xl mx-auto rounded-md shadow-2xl border sm:mt-12 block dark:hidden"
                    />
                )}
            </div>
        </div>
    );
}
