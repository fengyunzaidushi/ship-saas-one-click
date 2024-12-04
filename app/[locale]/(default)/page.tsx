import { use } from 'react';
import ShadcnLandingPage from "@/templates/shadcn/pages/landing";

export default function LandingPage({ params }) {
  const unwrappedParams = use(params) as { locale: string };
  const locale = unwrappedParams.locale;
  return (
    <ShadcnLandingPage locale={locale} />
  );
}
