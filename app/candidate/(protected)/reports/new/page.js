import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import RescueReportForm from '@/components/candidate/RescueReportForm';

export default function NewReportPage() {
  return <div className="mx-auto max-w-3xl space-y-6"><Link href="/candidate/reports/" className="inline-flex items-center gap-2 text-sm font-black text-primary/55 hover:text-primary"><ArrowLeft className="h-4 w-4" /> Back to my reports</Link><RescueReportForm /></div>;
}
