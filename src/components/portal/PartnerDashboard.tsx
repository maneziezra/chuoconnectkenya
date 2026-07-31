'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard, BarChart2, Users, Edit3, Star,
  Building2, TrendingUp, TrendingDown, Minus,
  Download, Reply, ExternalLink, UploadCloud, CheckCircle2, Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { University } from '@/lib/types';

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

const CHART_DATA = [
  { name: 'Below 25', interest: 20 },
  { name: '25-30', interest: 45 },
  { name: '30-35', interest: 85 },
  { name: '35-40', interest: 100 },
  { name: '40-48', interest: 60 },
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
    <div
      style={{
        background: 'white',
        padding: 24,
        borderRadius: 12,
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--navy-deep)', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10, fontSize: '0.82rem', color: isFlat ? 'var(--text-tertiary)' : isUp ? '#10B981' : '#EF4444' }}>
        {isFlat ? <Minus size={13} /> : isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
        {isFlat ? 'No change' : `${isUp ? '+' : ''}${change}% vs last month`}
      </div>
    </div>
  );
}

function OverviewTab() {
  return (
    <div>
      <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--navy-deep)', marginBottom: 24, fontSize: '1.5rem' }}>
        Dashboard Overview
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
        <MetricCard label="Profile Views (30d)" value="14,208" change={12.4} />
        <MetricCard label="Prospective Leads" value="842" change={5.2} />
        <MetricCard label="Avg Recommendation" value="89%" change={0} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: 'white', border: '1px solid var(--border-light)', borderRadius: 12, padding: 24 }}>
          <div style={{ fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 16 }}>Top Courses by Interest</div>
          {['Computer Science', 'Software Engineering', 'Data Science', 'Information Technology'].map((c, i) => (
            <div key={c} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{c}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 80, height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--gold-primary)', width: `${[92, 78, 65, 54][i]}%` }} />
                </div>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: 'var(--navy-deep)', fontWeight: 600 }}>
                  {[92, 78, 65, 54][i]}%
                </span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', border: '1px solid var(--border-light)', borderRadius: 12, padding: 24 }}>
          <div style={{ fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 16 }}>Recent Activity</div>
          {[
            { text: 'Fatuma A. applied via Chuo Connect', time: '2 hrs ago', color: '#10B981' },
            { text: 'Joy M. saved your profile to favourites', time: '5 hrs ago', color: 'var(--gold-primary)' },
            { text: 'New 5-star review received', time: '1 day ago', color: 'var(--gold-primary)' },
            { text: 'Kevin O. viewed your campus profile', time: '1 day ago', color: 'var(--text-tertiary)' },
          ].map(a => (
            <div key={a.text} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border-light)', alignItems: 'flex-start' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, flexShrink: 0, marginTop: 5 }} />
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--navy-deep)' }}>{a.text}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div>
      <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--navy-deep)', marginBottom: 24, fontSize: '1.5rem' }}>
        Audience Analytics
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ background: 'white', border: '1px solid var(--border-light)', borderRadius: 12, padding: 24 }}>
          <div style={{ fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 20 }}>Interest by KCSE Cluster Points</div>
          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(26, 35, 56, 0.04)' }} 
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="interest" fill="var(--navy-deep)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: 16 }}>
            <Star size={14} style={{ color: 'var(--gold-primary)' }} /> Highest interest from students scoring 35-40 cluster points
          </div>
        </div>

        <div style={{ background: 'white', border: '1px solid var(--border-light)', borderRadius: 12, padding: 24 }}>
          <div style={{ fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 20 }}>Visitor Breakdown</div>
          {[
            { label: 'Students (KCSE Leavers)', pct: 68, color: 'var(--navy-deep)' },
            { label: 'Parents / Guardians', pct: 22, color: 'var(--gold-primary)' },
            { label: 'School Counsellors', pct: 10, color: '#10B981' },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                <span style={{ fontWeight: 700, color: 'var(--navy-deep)', fontFamily: 'JetBrains Mono, monospace' }}>{item.pct}%</span>
              </div>
              <div style={{ height: 8, background: 'var(--bg-tertiary)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${item.pct}%`, background: item.color, borderRadius: 4 }} />
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
    'Favorited': 'var(--gold-primary)',
    'Viewed': 'var(--text-tertiary)',
    'Enrolled': '#10B981',
    'Contacted': '#3B82F6',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--navy-deep)', fontSize: '1.5rem' }}>Leads Pipeline</h2>
        <button className="btn btn-outline btn-sm" onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div style={{ background: 'white', border: '1px solid var(--border-light)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-light)' }}>
            <tr>
              {['Student', 'Cluster Pts', 'Target Course', 'Status', 'Action'].map(h => (
                <th key={h} style={{ padding: '14px 16px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: 24, textAlign: 'center', color: 'var(--text-tertiary)' }}><Loader2 size={24} className="animate-spin mx-auto" /></td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 24, textAlign: 'center', color: 'var(--text-tertiary)' }}>No leads found.</td></tr>
            ) : leads.map((lead) => (
              <tr key={lead.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--navy-deep)', fontSize: '0.92rem' }}>{lead.student_name}</td>
                <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{lead.cluster_points || '-'}</td>
                <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{lead.target_course || 'Undecided'}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: statusColor[lead.status] || 'var(--text-secondary)' }}>{lead.status}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <a href={`mailto:student@example.com?subject=Chuo Connect Inquiry regarding ${lead.target_course || 'your application'}`} className="btn btn-outline btn-sm" style={{ padding: '6px 12px', fontSize: '0.78rem', textDecoration: 'none', display: 'inline-block' }}>Contact</a>
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
    // In a real scenario we use API route or server action to handle auth gracefully,
    // but here we just update via supabase client (needs RLS to be configured properly for admins)
    const { error } = await supabase.from('universities').update(formData).eq('id', uni.id);
    
    setLoading(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--navy-deep)', fontSize: '1.5rem' }}>Profile Editor</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: 4 }}>Changes are reflected live on your public Chuo Connect profile.</p>
        </div>
        <button
          className="btn btn-gold"
          onClick={handleSave}
          disabled={loading || saved}
          style={{ width: 160, justifyContent: 'center' }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : saved ? <><CheckCircle2 size={16} /> Published!</> : 'Publish Changes'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Core */}
        <div style={{ background: 'white', border: '1px solid var(--border-light)', borderRadius: 12, padding: 24 }}>
          <h3 style={{ color: 'var(--navy-deep)', fontWeight: 600, marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid var(--border-light)' }}>Core Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div className="form-group">
              <label className="form-label">Student Population</label>
              <input className="form-input" value={formData.students} onChange={e => setFormData({...formData, students: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Estimated Fees per Year</label>
              <input className="form-input" value={formData.fees} onChange={e => setFormData({...formData, fees: e.target.value})} />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">Accommodation Description</label>
            <textarea className="form-textarea" value={formData.accommodation} onChange={e => setFormData({...formData, accommodation: e.target.value})} rows={3} />
          </div>
        </div>

        {/* Media */}
        <div style={{ background: 'white', border: '1px solid var(--border-light)', borderRadius: 12, padding: 24 }}>
          <h3 style={{ color: 'var(--navy-deep)', fontWeight: 600, marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid var(--border-light)' }}>Media & Links</h3>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label">Virtual Tour URL</label>
            <input className="form-input" value={formData.virtualTourUrl} onChange={e => setFormData({...formData, virtualTourUrl: e.target.value})} placeholder="https://youruniversity.edu/virtual-tour" />
          </div>
          <div className="form-group">
            <label className="form-label">University Website</label>
            <input className="form-input" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} placeholder="https://youruniversity.ac.ke" />
          </div>
          <div style={{ marginTop: 16 }}>
            <label className="form-label" style={{ display: 'block', marginBottom: 8 }}>Gallery Images</label>
            <div
              style={{
                border: '2px dashed var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '32px',
                textAlign: 'center',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <UploadCloud size={32} style={{ margin: '0 auto 8px', color: 'var(--text-tertiary)' }} />
              <div style={{ fontWeight: 500, marginBottom: 4 }}>Drag and drop images here</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>PNG, JPG up to 5MB each · Max 20 images</div>
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
      <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--navy-deep)', marginBottom: 24, fontSize: '1.5rem' }}>Review Management</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {MOCK_REVIEWS.map((r, i) => (
          <div key={i} style={{ background: 'white', border: '1px solid var(--border-light)', borderRadius: 12, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--navy-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                  {r.initials}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--navy-deep)', fontSize: '0.95rem' }}>{r.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{r.type} Review</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({length: r.rating}).map((_, idx) => (
                  <Star key={idx} size={14} fill="var(--gold-primary)" color="var(--gold-primary)" />
                ))}
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>&ldquo;{r.body}&rdquo;</p>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
              {replyOpen === i ? (
                <div>
                  <textarea className="form-textarea" placeholder="Write a professional response..." rows={2} style={{ marginBottom: 10 }} />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-navy btn-sm" onClick={() => { alert('Reply posted successfully!'); setReplyOpen(null); }}>Post Reply</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setReplyOpen(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => setReplyOpen(i)}>
                  <Reply size={14} /> Reply to Review
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
    <div style={{ display: 'flex', height: 'calc(100vh - var(--nav-height))', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div
        style={{
          width: 260,
          background: 'white',
          borderRight: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        {/* Uni info */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, background: 'var(--navy-deep)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Building2 size={18} color="var(--gold-primary)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--navy-deep)', fontSize: '0.88rem', lineHeight: 1.3 }}>{uni.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Partner Portal</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '12px 0', flex: 1 }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 20px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9rem',
                fontWeight: activeTab === tab.id ? 600 : 400,
                color: activeTab === tab.id ? 'var(--navy-deep)' : 'var(--text-secondary)',
                borderLeft: `3px solid ${activeTab === tab.id ? 'var(--gold-primary)' : 'transparent'}`,
                textAlign: 'left',
                transition: 'all 0.15s ease',
                background: activeTab === tab.id ? 'var(--navy-light)' : 'transparent',
              } as React.CSSProperties}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Footer link */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-light)' }}>
          <a
            href={`/universities/${uni.id.toLowerCase()}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--text-secondary)', textDecoration: 'none' }}
          >
            <ExternalLink size={13} />
            View Public Profile
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: 36, overflowY: 'auto', background: 'var(--bg-secondary)' }}>
        {activeTab === 'overview'  && <OverviewTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'leads'     && <LeadsTab uniId={uni.id} />}
        {activeTab === 'profile'   && <ProfileEditorTab uni={uni} />}
        {activeTab === 'reviews'   && <ReviewsTab />}
      </div>
    </div>
  );
}
