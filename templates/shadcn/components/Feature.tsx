import { Item, Section } from "@/types/landing";
import { useTranslations } from "next-intl";

export default function Feature() {
  const t = useTranslations('saas_one.feature');
  const items = t.raw('items');

  // 处理items为undefined或空数组的情况
  if (!items || !Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-t py-16 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
      <div className="mx-auto max-w-2xl text-center mb-16">
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {t('title')}
        </h2>
        <div className="mt-4 text-sm font-semibold tracking-wide">
          {t('description')}
        </div>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          {t('tip')}
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
          {items.map((item: Item, idx: number) => (
            <div
              key={idx}
              className="text-left p-6 border border-gray-200 rounded-lg shadow-sm"
            >
              {item.avatar && item.avatar.src && (
                <div className="mb-4 text-primary-500">
                  <img
                    src={item.avatar?.src}
                    alt={item.avatar?.title}
                    className="w-10 h-10"
                  />
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

