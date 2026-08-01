'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard, BarChart2, Users, Edit3, Star,
  Building2, TrendingUp, TrendingDown, Minus,
  Download, Reply, ExternalLink, UploadCloud, CheckCircle2, Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { University } from '@/lib/types';
import dynamic from 'next/dynamic';

const AnalyticsTab = dynamic(() => import('./PartnerAnalyticsTab'), {
  ssr: false,
  loading: () => <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-tertiary)' }}><Loader2 size={24} className="animate-spin mx-auto" /></div>
});

// Fallback Mock Data in case DB is empty
const MOCK_LEADS = [
  { id: '1', student_name: 'Joy M.', cluster_points: 42.5, target_course: 'Computer Science', status: 'Favorited' },
  { id: '2', student_name: 'Kevin O.', cluster_points: 38.2, target_course: 'Business IT', status: 'Viewed' },
  { id: '3', student_name: 'Fatuma A.', cluster_points: 44.1, target_course: 'Software Eng.', status: 'Enrolled' },
  { id: '4', student_name: 'Brian N.', cluster_points: 33.8, target_course: 'Information Technology', status: 'Viewed' },
  { id: '5', student_name: 'Aisha K.', cluster_points: 40.5, target_course: 'Data Science', status: 'Favorited' },
];

const MOCK_REVIEWS = [
  { initials: 'SM', name: 'Samuel M.', type: 'Student', rating: 5, body: 'The tech facilities are amazing, and the faculty is very supportive. Best decision I made for my IT degree.' },
  { initials: 'GW', name: 'Grace W.', type: 'Parent', rating: 4, body: 'Very transparent administration. Fees structure is clear and the accommodation options are well-managed.' },
  { initials: 'BN', name: 'Brian N.', type: 'Student', rating: 5, body: 'The innovation hub gave me access to equipment and mentors I wouldn\'t have found elsewhere. 10/10.' },
];

type Tab = 'overview' | 'analytics' | 'leads' | 'profile' | 'reviews';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview',  label: 'Overview',       icon: <LayoutDashboard size={18} /> },
  { id: 'analytics', label: 'Analytics',      icon: <BarChart2 size={18} /> },
  { id: 'leads',     label: 'Leads Pipeline', icon: <Users size={18} /> },
  { id: 'profile',   label: 'Profile Editor', icon: <Edit3 size={18} /> },
  { id: 'reviews',   label: 'Reviews',        icon: <Star size={18} /> },
];

function MetricCard({ label, value, change }: { label: string; value: string | number; change: number }) {
  const isUp = change > 0;
  const isFlat = change === 0;
  return (
    <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
        {label}
      </div>
      <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-jetbrains), monospace', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: '0.85rem', fontWeight: 600, color: isFlat ? 'var(--text-tertiary)' : isUp ? 'var(--success-text)' : '#EF4444' }}>
        {isFlat ? <Minus size={14} /> : isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {isFlat ? 'No change' : `${isUp ? '+' : ''}${change}% vs last month`}
      </div>
    </div>
  );
}

function OverviewTab() {
  return (
    <div>
      <h2 className="text-h2" style={{ marginBottom: 24 }}>Dashboard Overview</h2>

      <div className="dashboard-grid-3" style={{ marginBottom: 32 }}>
        <MetricCard label="Profile Views (30d)" value="14,208" change={12.4} />
        <MetricCard label="Prospective Leads" value="842" change={5.2} />
        <MetricCard label="Avg Recommendation" value="89%" change={0} />
      </div>

      <div className="dashboard-grid-2">
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, fontSize: '1.1rem' }}>Top Courses by Interest</div>
          {['Computer Science', 'Software Engineering', 'Data Science', 'Information Technology'].map((c, i) => (
            <div key={c} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{c}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 100, height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--accent-gold)', width: `${[92, 78, 65, 54][i]}%`, borderRadius: 3 }} />
                </div>
                <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {[92, 78, 65, 54][i]}%
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, fontSize: '1.1rem' }}>Recent Activity</div>
          {[
            { text: 'Fatuma A. applied via Chuo Connect', time: '2 hrs ago', color: 'var(--success-text)' },
            { text: 'Joy M. saved your profile to favourites', time: '5 hrs ago', color: 'var(--accent-gold)' },
            { text: 'New 5-star review received', time: '1 day ago', color: 'var(--accent-gold)' },
            { text: 'Kevin O. viewed your campus profile', time: '1 day ago', color: 'var(--text-tertiary)' },
          ].map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border-light)', alignItems: 'flex-start' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: a.color, flexShrink: 0, marginTop: 6, boxShadow: `0 0 0 4px ${a.color}20` }} />
              <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>{a.text}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 4 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LeadsTab({ uniId }: { uniId: string }) {
  const [leads, setLeads] = useState<any[]>(MOCK_LEADS);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadLeads() {
      const { data } = await supabase.from('university_leads').select('*').eq('universityId', uniId).order('createdAt', { ascending: false });
      if (data && data.length > 0) {
        setLeads(data);
      }
      setLoading(false);
    }
    loadLeads();
  }, [uniId, supabase]);

  const exportCSV = () => {
    const headers = ['Student Name', 'Target Course', 'Cluster Points', 'Status'];
    const rows = leads.map(l => [l.student_name, l.target_course || '', l.cluster_points || '', l.status]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_${uniId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusColor: Record<string, string> = {
    'Favorited': 'var(--accent-gold)',
    'Viewed': 'var(--text-tertiary)',
    'Enrolled': 'var(--success-text)',
    'Contacted': 'var(--info-text)',
  };

  return (
    <div>
      <div className="dashboard-header">
        <h2 className="text-h2">Leads Pipeline</h2>
        <button className="btn btn-outline btn-sm" onClick={exportCSV}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-light)' }}>
            <tr>
              {['Student', 'Cluster Pts', 'Target Course', 'Status', 'Action'].map(h => (
                <th key={h} style={{ padding: '16px 20px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: 'var(--text-tertiary)' }}><Loader2 size={24} className="animate-spin mx-auto" /></td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: 'var(--text-tertiary)' }}>No leads found.</td></tr>
            ) : leads.map((lead) => (
              <tr key={lead.id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'var(--transition)' }} className="table-row-hover">
                <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{lead.student_name}</td>
                <td style={{ padding: '16px 20px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{lead.cluster_points || '-'}</td>
                <td style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{lead.target_course || 'Undecided'}</td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: statusColor[lead.status] || 'var(--text-secondary)', padding: '4px 10px', background: `${statusColor[lead.status] || 'var(--text-tertiary)'}15`, borderRadius: '6px' }}>{lead.status}</span>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <a href={`mailto:student@example.com?subject=Chuo Connect Inquiry regarding ${lead.target_course || 'your application'}`} className="btn btn-outline btn-sm">Contact</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProfileEditorTab({ uni }: { uni: University }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    students: uni.students,
    fees: uni.fees,
    accommodation: uni.accommodation,
    virtualTourUrl: uni.virtualTourUrl || '',
    website: uni.website || ''
  });
  
  const supabase = createClient();

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase.from('universities').update(formData).eq('id', uni.id);
    
    setLoading(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h2 className="text-h2">Profile Editor</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 8 }}>Changes are reflected live on your public Chuo Connect profile.</p>
        </div>
        <button className="btn btn-gold dashboard-header-btn" onClick={handleSave} disabled={loading || saved} style={{ justifyContent: 'center' }}>
          {loading ? <Loader2 size={18} className="animate-spin" /> : saved ? <><CheckCircle2 size={18} /> Published!</> : 'Publish Changes'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="card" style={{ padding: 32 }}>
          <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.2rem', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-light)' }}>Core Details</h3>
          <div className="dashboard-grid-2" style={{ gap: 24 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="students">Student Population</label>
              <input id="students" className="form-input" value={formData.students} onChange={e => setFormData({...formData, students: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="fees">Estimated Fees per Year</label>
              <input id="fees" className="form-input" value={formData.fees} onChange={e => setFormData({...formData, fees: e.target.value})} />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: 24 }}>
            <label className="form-label" htmlFor="accommodation">Accommodation Description</label>
            <textarea id="accommodation" className="form-textarea" value={formData.accommodation} onChange={e => setFormData({...formData, accommodation: e.target.value})} rows={4} />
          </div>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.2rem', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-light)' }}>Media & Links</h3>
          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="form-label" htmlFor="virtualTourUrl">Virtual Tour URL</label>
            <input id="virtualTourUrl" className="form-input" value={formData.virtualTourUrl} onChange={e => setFormData({...formData, virtualTourUrl: e.target.value})} placeholder="https://youruniversity.edu/virtual-tour" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="website">University Website</label>
            <input id="website" className="form-input" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} placeholder="https://youruniversity.ac.ke" />
          </div>
          <div style={{ marginTop: 24 }}>
            <label className="form-label" style={{ display: 'block', marginBottom: 12 }}>Gallery Images</label>
            <div style={{ border: '2px dashed var(--border-medium)', borderRadius: 'var(--radius-lg)', padding: '48px', textAlign: 'center', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'var(--transition)', background: 'var(--bg-secondary)' }} className="upload-zone">
              <UploadCloud size={40} style={{ margin: '0 auto 12px', color: 'var(--accent-gold)' }} />
              <div style={{ fontWeight: 600, marginBottom: 8, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Drag and drop images here</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>PNG, JPG up to 5MB each · Max 20 images</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewsTab() {
  const [replyOpen, setReplyOpen] = useState<number | null>(null);

  return (
    <div>
      <h2 className="text-h2" style={{ marginBottom: 32 }}>Review Management</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {MOCK_REVIEWS.map((r, i) => (
          <div key={i} className="card" style={{ padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--accent-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-primary)', fontWeight: 700, fontSize: '1rem' }}>
                  {r.initials}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{r.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: 2 }}>{r.type} Review</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {Array.from({length: 5}).map((_, idx) => (
                  <Star key={idx} size={16} fill={idx < r.rating ? "var(--accent-gold)" : "transparent"} color={idx < r.rating ? "var(--accent-gold)" : "var(--border-medium)"} />
                ))}
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, fontStyle: 'italic' }}>&ldquo;{r.body}&rdquo;</p>
            <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border-light)' }}>
              {replyOpen === i ? (
                <div>
                  <textarea className="form-textarea" placeholder="Write a professional response..." rows={3} style={{ marginBottom: 16 }} />
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-navy" onClick={() => { alert('Reply posted successfully!'); setReplyOpen(null); }}>Post Reply</button>
                    <button className="btn btn-ghost" onClick={() => setReplyOpen(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button className="btn btn-outline btn-sm" onClick={() => setReplyOpen(i)}>
                  <Reply size={16} /> Reply to Review
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PartnerDashboard({ uni }: { uni: University }) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  return (
    <>
      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          {/* Uni info */}
          <div className="dashboard-brand" style={{ padding: '32px 24px', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, background: 'var(--accent-main)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Building2 size={24} color="var(--bg-primary)" />
              </div>
              <div>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem', lineHeight: 1.2 }}>{uni.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 4, fontWeight: 500 }}>Partner Portal</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="dashboard-nav" style={{ padding: '24px 0', flex: 1 }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                data-active={activeTab === tab.id}
                className="dashboard-nav-item"
              >
                <span className="icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Footer link */}
          <div className="dashboard-footer" style={{ padding: '24px', borderTop: '1px solid var(--border-light)' }}>
            <a
              href={`/universities/${uni.id.toLowerCase()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
              style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--text-secondary)' }}
            >
              <ExternalLink size={16} />
              View Public Profile
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          <div className="dashboard-content-inner">
            {activeTab === 'overview'  && <OverviewTab />}
            {activeTab === 'analytics' && <AnalyticsTab />}
            {activeTab === 'leads'     && <LeadsTab uniId={uni.id} />}
            {activeTab === 'profile'   && <ProfileEditorTab uni={uni} />}
            {activeTab === 'reviews'   && <ReviewsTab />}
          </div>
        </main>
      </div>
    </>
  );
}
