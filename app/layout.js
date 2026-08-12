import "./globals.css";

export const metadata = {
  title: "LAHIT Animal Welfare | Helping Stray Animals in Uttarakhand",
  description: "LAHIT Animal Welfare is a volunteer-led initiative dedicated to rescuing, feeding, and rehabilitating stray and injured animals across Uttarakhand, India.",
  keywords: ["animal rescue", "Uttarakhand", "stray animals", "animal welfare", "dog rescue", "cat rescue", "volunteer", "donate"],
  authors: [{ name: "LAHIT Animal Welfare" }],
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
  },
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
        {children}
      </body>
    </html>
  );
}
