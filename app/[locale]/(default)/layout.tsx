

import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { SearchProvider, SearchConfig } from 'pliny/search'
import SearchProviderCustom from '@/components/SearchProviderCustom'
import Header from '@/components/Header'
import Footer from '@/templates/shadcn/components/Footer'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from '../../theme-providers'
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // Await the locale parameter
    const { locale } = await params;

    // Validate locale
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Get messages for internationalization
    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages} locale={locale}>
            <ThemeProviders>
                <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
                <SectionContainer>
                    <SearchProviderCustom>
                        <Header />
                       
                        <main className="mb-auto">{children}</main>
                    </SearchProviderCustom>
                    <Footer />
                </SectionContainer>
            </ThemeProviders>
        </NextIntlClientProvider>
    )
}

