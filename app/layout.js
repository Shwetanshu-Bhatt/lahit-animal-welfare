import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-[#F5F5DC]`}>
        {children}
      </body>
    </html>
  );
}
