'use client';

import { useEffect, useMemo, useState } from 'react';
import { Clock3, MapPin, Phone, Siren, Trash2 } from 'lucide-react';

const statuses = ['all', 'new', 'reviewing', 'dispatched', 'resolved', 'dismissed'];

export default function RescueReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [processing, setProcessing] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/rescue-reports', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => data.success ? setReports(data.data) : setError(data.error || 'Could not load reports'))
      .catch(() => setError('Could not load reports'))
      .finally(() => setLoading(false));
  }, []);

  const visibleReports = useMemo(
    () => filter === 'all' ? reports : reports.filter((report) => report.status === filter),
    [filter, reports]
  );

  async function updateStatus(id, status) {
    setProcessing(id);
    setError('');
    const response = await fetch(`/api/rescue-reports/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (data.success) {
      setReports((current) => current.map((report) => report._id === id ? data.data : report));
      window.dispatchEvent(new Event('rescue-reports-changed'));
    }
    else setError(data.error || 'Could not update report');
    setProcessing(null);
  }

  async function deleteReport(id) {
    if (!window.confirm('Delete this rescue report permanently?')) return;
    setProcessing(id);
    const response = await fetch(`/api/rescue-reports/${id}`, { method: 'DELETE' });
    const data = await response.json();
    if (data.success) {
      setReports((current) => current.filter((report) => report._id !== id));
      window.dispatchEvent(new Event('rescue-reports-changed'));
    }
    else setError(data.error || 'Could not delete report');
    setProcessing(null);
  }

  if (loading) return <div className="admin-empty">Loading rescue reports…</div>;

  return (
    <div>
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">Emergency workflow</span>
          <h2>Rescue inbox</h2>
          <p>Reports submitted from the public emergency form arrive here immediately.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button key={status} onClick={() => setFilter(status)} className={`admin-filter ${filter === status ? 'admin-filter-active' : ''}`}>
              {status} {status !== 'all' && <span>{reports.filter((report) => report.status === status).length}</span>}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="alert alert-error mb-5"><span>{error}</span></div>}
      {visibleReports.length === 0 ? (
        <div className="admin-empty"><Siren className="h-8 w-8" /><p>No rescue reports in this view.</p></div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {visibleReports.map((report) => (
            <article key={report._id} className="admin-report-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className={`admin-status admin-status-${report.status}`}>{report.status}</span>
                  <h3 className="mt-4 text-xl font-black tracking-[-0.03em] text-primary">{report.animalType} rescue</h3>
                </div>
                <p className="flex items-center gap-2 text-xs font-semibold text-primary/45"><Clock3 className="h-4 w-4" />{new Date(report.createdAt).toLocaleString()}</p>
              </div>
              <p className="mt-4 leading-relaxed text-primary/70">{report.description}</p>
              <div className="mt-5 grid gap-2 text-sm text-primary/60 sm:grid-cols-2">
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-secondary" />{report.location}</p>
                <a href={`tel:${report.phone}`} className="flex items-center gap-2 hover:text-primary"><Phone className="h-4 w-4 text-secondary" />{report.reporterName} · {report.phone}</a>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-primary/10 pt-5">
                <select value={report.status} disabled={processing === report._id} onChange={(event) => updateStatus(report._id, event.target.value)} className="select select-bordered select-sm min-w-40">
                  {statuses.slice(1).map((status) => <option key={status}>{status}</option>)}
                </select>
                <a href={`tel:${report.phone}`} className="btn btn-sm btn-primary">Call reporter</a>
                <button onClick={() => deleteReport(report._id)} disabled={processing === report._id} className="btn btn-sm btn-ghost ml-auto text-error" aria-label="Delete report"><Trash2 className="h-4 w-4" /></button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
