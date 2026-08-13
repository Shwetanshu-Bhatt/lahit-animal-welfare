'use client';

import { useState } from 'react';
import { Camera, CheckCircle2, MapPin, Send } from 'lucide-react';

export default function RescueReportForm({ onSubmitted }) {
  const [form, setForm] = useState({ phone: '', animalType: 'Dog', location: '', description: '' });
  const [image, setImage] = useState('');
  const [imageError, setImageError] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) { setForm((current) => ({ ...current, [field]: value })); }

  function handleImage(file) {
    setImageError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) return setImageError('Please choose an image file.');
    if (file.size > 8 * 1024 * 1024) return setImageError('Photo must be smaller than 8 MB.');
    const reader = new FileReader();
    reader.onload = () => {
      const source = new window.Image();
      source.onload = () => {
        const scale = Math.min(1, 1200 / Math.max(source.width, source.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(source.width * scale); canvas.height = Math.round(source.height * scale);
        canvas.getContext('2d').drawImage(source, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL('image/webp', 0.78);
        if (compressed.length > 2_000_000) setImageError('This photo is still too large. Please choose another.');
        else setImage(compressed);
      };
      source.onerror = () => setImageError('Could not read this photo.');
      source.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  async function submit(event) {
    event.preventDefault(); setSubmitting(true); setError('');
    try {
      const response = await fetch('/api/candidate/reports/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, image }) });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Could not submit report.');
      setSubmitted(true); setForm({ phone: '', animalType: 'Dog', location: '', description: '' }); setImage(''); onSubmitted?.(result.data);
    } catch (submitError) { setError(submitError.message); } finally { setSubmitting(false); }
  }

  if (submitted) return <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white"><CheckCircle2 className="h-8 w-8" /></span><h3 className="mt-5 text-2xl font-black text-primary">Report received</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-primary/55">Thank you for stepping in. The rescue team will review the case and use your phone number if they need more information.</p><button type="button" onClick={() => setSubmitted(false)} className="mt-7 min-h-11 rounded-full bg-primary px-5 text-sm font-black text-white">Submit another report</button></div>;

  return <form onSubmit={submit} className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8"><div className="mb-7"><span className="inline-flex rounded-full bg-secondary/10 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-secondary">Emergency report</span><h3 className="mt-3 text-2xl font-black tracking-[-0.04em] text-primary">Tell us where help is needed</h3><p className="mt-2 text-sm leading-6 text-primary/55">Share clear, accurate details so our team can respond quickly. For immediate danger, call the hotline as well.</p></div>{error && <div className="mb-5 rounded-2xl bg-error/10 p-4 text-sm font-semibold text-error">{error}</div>}<div className="grid gap-5 sm:grid-cols-2"><label className="block"><span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-primary/55">Callback phone</span><input required type="tel" value={form.phone} onChange={(event) => update('phone', event.target.value)} className="h-12 w-full rounded-xl border border-primary/15 bg-base-200 px-4 text-primary outline-none focus:border-primary" placeholder="Your phone number" /></label><label className="block"><span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-primary/55">Animal type</span><select value={form.animalType} onChange={(event) => update('animalType', event.target.value)} className="h-12 w-full rounded-xl border border-primary/15 bg-base-200 px-4 text-primary outline-none focus:border-primary">{['Dog', 'Cat', 'Cow', 'Bird', 'Other'].map((type) => <option key={type}>{type}</option>)}</select></label><label className="block sm:col-span-2"><span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-primary/55"><MapPin className="h-4 w-4" /> Exact location</span><input required value={form.location} onChange={(event) => update('location', event.target.value)} className="h-12 w-full rounded-xl border border-primary/15 bg-base-200 px-4 text-primary outline-none focus:border-primary" placeholder="Landmark, area, or Google Maps link" /></label><label className="block sm:col-span-2"><span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-primary/55">What happened?</span><textarea required rows={5} value={form.description} onChange={(event) => update('description', event.target.value)} className="w-full rounded-xl border border-primary/15 bg-base-200 px-4 py-3 text-primary outline-none focus:border-primary" placeholder="Describe the animal's condition and anything that will help the rescue team." /></label><label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-primary/20 bg-base-200 px-4 text-sm font-bold text-primary/65 sm:col-span-2"><Camera className="h-5 w-5 text-secondary" /><span className="flex-1">{image ? 'Photo attached' : 'Attach a photo (optional)'}</span><input type="file" accept="image/*" onChange={(event) => handleImage(event.target.files?.[0])} className="sr-only" /></label>{imageError && <p className="-mt-3 text-sm font-semibold text-error sm:col-span-2">{imageError}</p>}<button type="submit" disabled={submitting} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-black text-white transition-colors hover:bg-[#164a36] disabled:opacity-50 sm:col-span-2">{submitting ? 'Sending report…' : <><Send className="h-4 w-4" /> Send rescue report</>}</button></div></form>;
}
