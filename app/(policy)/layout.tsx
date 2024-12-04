import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Policy',
  description: 'Policy pages',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="policy-layout">
            {children}
        </div>
    );
}