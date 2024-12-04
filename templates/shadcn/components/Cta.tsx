import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

// 定义按钮类型接口

export default function () {
    const t = useTranslations('saas_one.cta');

    // 使用类型断言来指定buttons的类型
    const buttons = t.raw('buttons') as any[] || [];

    return (
        <section className="bg-gradient-to-t from-zinc-50 to-white dark:from-zinc-950 relative">
            <div className="absolute bg-[url('/_convertfast/gradient-bg-0.svg')] bg-auto bg-no-repeat inset-0 top-0 bottom-0 left-0 right-0 grayscale bg-center"></div>
            <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32 relative z-10">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-red-500 text-3xl font-bold tracking-tight text-primary sm:text-3xl text-center lg:text-5xl">
                        {t('title')}
                    </h2>
                    {/* <h2 className="text-4xl  text-red-500 sm:text-3xl lg:text-blue-500  lg:text-5xl">
                        测试文本
                    </h2> */}
                    <p className="mt-6 text-xl leading-8 opacity-90 text-muted-foreground">
                        {t('description')}
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                        {buttons?.map((v, idx) => (
                            <Link key={idx} href={v.url || ""} target={v.target || "_blank"}>
                                <Button
                                    key={idx}
                                    size="lg"
                                    variant={v.theme === "outline" ? "outline" : "default"}
                                    className="w-full sm:w-auto"
                                >
                                    {v.title}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
