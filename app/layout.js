import "./globals.css";
import StructuredData from '@/components/StructuredData';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Animal Rescue, Adoption & Volunteer Support in Uttarakhand`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ["animal rescue", "Uttarakhand", "stray animals", "animal welfare", "dog rescue", "cat rescue", "volunteer", "donate"],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'nonprofit',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  icons: {
    icon: '/lahit.png',
    shortcut: '/lahit.png',
    apple: '/lahit.png',
  },
  openGraph: {
    title: "LAHIT Animal Welfare | Helping Stray Animals in Uttarakhand",
    description: "Join us in our mission to rescue, treat, and rehome injured and abandoned animals across Uttarakhand.",
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
  },
  twitter: { card: 'summary', title: SITE_NAME, description: SITE_DESCRIPTION },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" data-theme="lahit">
      <body className="font-sans antialiased bg-base-200">
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
