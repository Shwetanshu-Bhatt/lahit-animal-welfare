import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Container from '@/components/ui/Container';
import PublicSiteGate from '@/components/PublicSiteGate';

export const metadata = {
  title: 'Animal Rescue in Uttarkashi, Uttarakhand',
  description: 'Need help for an injured or stray animal in Uttarkashi? Learn how to send LAHIT a rescue report, see animals for adoption, and join local animal welfare efforts.',
  alternates: { canonical: '/uttarkashi/' },
  openGraph: {
    title: 'Animal Rescue in Uttarkashi | LAHIT Animal Welfare',
    description: 'Report an animal in need, explore adoption, and support volunteer-led animal welfare in Uttarkashi, Uttarakhand.',
    url: '/uttarkashi/',
  },
};

export default function UttarkashiPage() {
  return (
    <PublicSiteGate>
      <main className="public-page min-h-screen bg-base-200">
        <Navbar />
        <section className="bg-primary pt-32 pb-16 text-white sm:pt-40 sm:pb-20">
          <Container>
            <p className="eyebrow text-accent">Uttarkashi · Uttarakhand</p>
            <h1 className="display-title mt-5 max-w-4xl text-4xl uppercase sm:text-6xl">Animal rescue and welfare in Uttarkashi</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              LAHIT is a volunteer-led animal welfare group based in Uttarkashi. We help coordinate reports of stray and injured animals, share rescue updates, and connect animals with people who can care for them.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/#emergency" className="inline-flex min-h-12 items-center rounded-full bg-accent px-6 font-bold text-primary">Report an animal in need</Link>
              <Link href="/animals/" className="inline-flex min-h-12 items-center rounded-full border border-white/30 px-6 font-bold text-white">See animals for adoption</Link>
            </div>
          </Container>
        </section>

        <section className="section-padding">
          <Container>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-[1.75rem] bg-white p-7 sm:p-10">
                <h2 className="text-2xl font-black tracking-tight text-primary sm:text-3xl">Found an injured or stray animal?</h2>
                <p className="mt-4 leading-relaxed text-primary/70">Send a rescue report with the animal&apos;s exact location in Uttarkashi, its condition, a way to call you back, and a photo if it is safe to take one. This helps volunteers assess the report and coordinate the next step.</p>
                <p className="mt-4 leading-relaxed text-primary/70">For an immediate life-threatening situation, contact a local veterinarian or appropriate emergency service first. Website reports are not an emergency dispatch service.</p>
                <Link href="/#emergency" className="mt-6 inline-block font-bold text-primary underline underline-offset-4">How to report a rescue</Link>
              </div>
              <div className="rounded-[1.75rem] bg-white p-7 sm:p-10">
                <h2 className="text-2xl font-black tracking-tight text-primary sm:text-3xl">Help animals in Uttarkashi</h2>
                <p className="mt-4 leading-relaxed text-primary/70">Explore animals currently listed for adoption, read documented rescue stories, or offer your time as a volunteer. Availability and response depend on the team and local resources.</p>
                <ul className="mt-6 space-y-3 font-bold text-primary">
                  <li><Link href="/animals/" className="underline underline-offset-4">Animals for adoption</Link></li>
                  <li><Link href="/rescues/" className="underline underline-offset-4">Rescue and recovery stories</Link></li>
                  <li><Link href="/#volunteer" className="underline underline-offset-4">Volunteer with LAHIT</Link></li>
                </ul>
              </div>
            </div>
            <p className="mt-8 text-sm leading-relaxed text-primary/65">LAHIT is a volunteer-led initiative and is not currently a registered NGO. See our <Link href="/blog/" className="font-semibold underline underline-offset-4">field notes</Link> for updates on our animal welfare work across Uttarakhand.</p>
          </Container>
        </section>
        <Footer />
      </main>
    </PublicSiteGate>
  );
}
