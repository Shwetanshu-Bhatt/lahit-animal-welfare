'use client';

import { useEffect, useMemo, useState } from 'react';
import { Clock3, Home, Mail, MapPin, PawPrint, Phone, Trash2 } from 'lucide-react';

const statuses = ['all', 'new', 'contacted', 'screening', 'approved', 'rejected'];

export default function AdoptionInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [processing, setProcessing] = useState(null);
  const [error, setError] = useState('');
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null);

  useEffect(() => {
    fetch('/api/adoption-inquiries', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => data.success ? setInquiries(data.data) : setError(data.error || 'Could not load adoption inquiries'))
      .catch(() => setError('Could not load adoption inquiries'))
      .finally(() => setLoading(false));
  }, []);

  const visibleInquiries = useMemo(
    () => filter === 'all' ? inquiries : inquiries.filter((inquiry) => inquiry.status === filter),
    [filter, inquiries]
  );

  async function updateStatus(id, status, skipWarning = false) {
    const inquiry = inquiries.find((item) => item._id === id);
    const previousStatus = inquiry?.status;

    if (!skipWarning && (previousStatus === 'approved' || previousStatus === 'rejected')) {
      setPendingStatusUpdate({
        id,
        status,
        previousStatus,
        animalName: inquiry?.animalName || 'this animal',
      });
      return;
    }

    setProcessing(id);
    setError('');
    try {
      const response = await fetch(`/api/adoption-inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.success) {
        setInquiries((current) => current.map((inquiry) => inquiry._id === id ? data.data : inquiry));
        window.dispatchEvent(new Event('adoption-inquiries-changed'));
      } else setError(data.error || 'Could not update adoption inquiry');
    } catch {
      setError('Could not update adoption inquiry');
    } finally {
      setProcessing(null);
      setPendingStatusUpdate(null);
    }
  }

  async function deleteInquiry(id) {
    if (!window.confirm('Delete this adoption inquiry permanently?')) return;
    setProcessing(id);
    setError('');
    try {
      const response = await fetch(`/api/adoption-inquiries/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setInquiries((current) => current.filter((inquiry) => inquiry._id !== id));
        window.dispatchEvent(new Event('adoption-inquiries-changed'));
      } else setError(data.error || 'Could not delete adoption inquiry');
    } catch {
      setError('Could not delete adoption inquiry');
    } finally {
      setProcessing(null);
    }
  }

  if (loading) return <div className="admin-empty">Loading adoption inquiries…</div>;

  return (
    <div>
      {pendingStatusUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/30 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-3xl border border-primary/10 bg-base-100 p-6 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-warning/10 px-2.5 py-1 text-xs font-black uppercase tracking-[0.12em] text-warning">
                Warning
              </span>
            </div>
            <h3 className="text-2xl font-black tracking-[-0.04em] text-primary">Change adoption status?</h3>
            <p className="mt-3 text-sm leading-relaxed text-primary/65">
              This request is already marked as <span className="font-bold text-primary">{pendingStatusUpdate.previousStatus}</span>.
              Changing it again will also update the linked animal record for <span className="font-bold text-primary">{pendingStatusUpdate.animalName}</span> and may change its availability.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingStatusUpdate(null)}
                className="btn btn-ghost btn-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => updateStatus(pendingStatusUpdate.id, pendingStatusUpdate.status, true)}
                className="btn btn-warning btn-sm"
              >
                Continue update
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-page-heading">
        <div><span className="admin-eyebrow">Adoption workflow</span><h2>Adoption inbox</h2><p>Applications submitted from published animal profiles arrive here.</p></div>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => <button key={status} onClick={() => setFilter(status)} className={`admin-filter ${filter === status ? 'admin-filter-active' : ''}`}>{status} {status !== 'all' && <span>{inquiries.filter((item) => item.status === status).length}</span>}</button>)}
        </div>
      </div>
      {error && <div className="alert alert-error mb-5"><span>{error}</span></div>}
      {visibleInquiries.length === 0 ? (
        <div className="admin-empty"><PawPrint className="h-8 w-8" /><p>No adoption inquiries in this view.</p></div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {visibleInquiries.map((inquiry) => (
            <article key={inquiry._id} className="admin-report-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><span className={`admin-status admin-status-${inquiry.status}`}>{inquiry.status}</span><h3 className="mt-4 text-xl font-black tracking-[-0.03em] text-primary">Adopt {inquiry.animalName}</h3></div>
                <p className="flex items-center gap-2 text-xs font-semibold text-primary/45"><Clock3 className="h-4 w-4" />{new Date(inquiry.createdAt).toLocaleString()}</p>
              </div>
              <h4 className="mt-5 font-bold text-primary">{inquiry.applicantName}</h4>
              <div className="mt-3 grid gap-2 text-sm text-primary/60 sm:grid-cols-2">
                <a href={`tel:${inquiry.phone}`} className="flex items-center gap-2 hover:text-primary"><Phone className="h-4 w-4 text-secondary" />{inquiry.phone}</a>
                <a href={`mailto:${inquiry.email}`} className="flex min-w-0 items-center gap-2 break-all hover:text-primary"><Mail className="h-4 w-4 shrink-0 text-secondary" />{inquiry.email}</a>
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-secondary" />{inquiry.location}</p>
                <p className="flex items-center gap-2"><Home className="h-4 w-4 text-secondary" />{inquiry.homeType}</p>
              </div>
              {inquiry.experience && <p className="mt-4 text-sm leading-relaxed text-primary/65"><strong>Pet experience:</strong> {inquiry.experience}</p>}
              {inquiry.message && <p className="mt-2 text-sm leading-relaxed text-primary/65">{inquiry.message}</p>}
              <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-primary/10 pt-5">
                <select value={inquiry.status} disabled={processing === inquiry._id} onChange={(event) => updateStatus(inquiry._id, event.target.value)} className="select select-bordered select-sm min-w-40">
                  {statuses.slice(1).map((status) => <option key={status}>{status}</option>)}
                </select>
                <a href={`tel:${inquiry.phone}`} className="btn btn-sm btn-primary">Call applicant</a>
                <button onClick={() => deleteInquiry(inquiry._id)} disabled={processing === inquiry._id} className="btn btn-sm btn-ghost ml-auto text-error" aria-label="Delete adoption inquiry"><Trash2 className="h-4 w-4" /></button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
