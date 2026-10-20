'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard, BarChart2, Users, Edit3, Star,
  Building2, TrendingUp, TrendingDown, Minus,
  Download, Reply, ExternalLink, UploadCloud, CheckCircle2, Loader2,
  Phone, Mail, MessageCircle, Search, Sparkles
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  LEAD_STATUSES,
  type LeadStatus,
  type University,
  type UniversityLead,
} from '@/lib/types';
import {
  FINANCING_LABELS,
  SOURCE_LABELS,
  buildContactLinks,
  computeLeadMetrics,
  formatRelativeTime,
  leadsToCsv,
  type LeadMetrics,
} from '@/lib/utils/leads';
import dynamic from 'next/dynamic';

const AnalyticsTab = dynamic(() => import('./PartnerAnalyticsTab'), {
  ssr: false,
  loading: () => (
    <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-tertiary)' }}>
      <Loader2 size={24} className="animate-spin mx-auto" />
    </div>
  ),
});

function buildDemoLeads(uniId: string): UniversityLead[] {
  const now = Date.now();
  const hr = 3600 * 1000;
  const day = 24 * hr;
  return [
    {
      id: 'demo-1',
      universityId: uniId,
      student_name: 'Joy Wanjiku Mwangi',
      phone: '+254712345678',
      email: 'joy.wanjiku@student.ke',
      cluster_points: 42.5,
      mean_grade: 'A-',
      target_course: 'BSc. Computer Science',
      financing_preference: 'hef_loan',
      hef_band: 2,
      source: 'calculator',
      status: 'New',
      consent: true,
      createdAt: new Date(now - 2 * hr).toISOString(),
    },
    {
      id: 'demo-2',
      universityId: uniId,
      student_name: 'Kevin Omondi Otieno',
      phone: '+254723456789',
      email: 'kevin.omondi@student.ke',
      cluster_points: 38.2,
      mean_grade: 'B+',
      target_course: 'Bachelor of Business Information Technology',
      financing_preference: 'scholarship',
      hef_band: 1,
      source: 'course_page',
      status: 'Contacted',
      consent: true,
      createdAt: new Date(now - 7 * hr).toISOString(),
    },
    {
      id: 'demo-3',
      universityId: uniId,
      student_name: 'Fatuma Amina Hassan',
      phone: '+254734567890',
      email: 'fatuma.hassan@student.ke',
      cluster_points: 44.1,
      mean_grade: 'A',
      target_course: 'BSc. Software Engineering',
      financing_preference: 'self_sponsored',
      hef_band: 4,
      source: 'university_page',
      status: 'Enrolled',
      consent: true,
      createdAt: new Date(now - 2 * day).toISOString(),
    },
    {
      id: 'demo-4',
      universityId: uniId,
      student_name: 'Brian Kiprop Ngeno',
      phone: '+254110123456',
      email: null,
      cluster_points: 33.8,
      mean_grade: 'B-',
      target_course: 'BSc. Information Technology',
      financing_preference: 'hef_loan',
      hef_band: 2,
      source: 'calculator',
      status: 'Applied',
      consent: true,
      createdAt: new Date(now - 4 * day).toISOString(),
    },
    {
      id: 'demo-5',
      universityId: uniId,
      student_name: 'Aisha Kemunto Nyaboke',
      phone: '+254745678901',
      email: 'aisha.kemunto@student.ke',
      cluster_points: 40.5,
      mean_grade: 'B+',
      target_course: 'BSc. Data Science & Analytics',
      financing_preference: 'hef_loan',
      hef_band: 3,
      source: 'course_page',
      status: 'New',
      consent: true,
      createdAt: new Date(now - 6 * day).toISOString(),
    },
  ];
}

function normalizeDbRow(row: Record<string, unknown>, fallbackUniId: string): UniversityLead {
  const statusRaw = String(row.status || 'New');
  const validStatus: LeadStatus = (LEAD_STATUSES as readonly string[]).includes(statusRaw)
    ? (statusRaw as LeadStatus)
    : 'New';

  return {
    id: String(row.id ?? crypto.randomUUID()),
    universityId: String(row.universityId ?? row.university_id ?? fallbackUniId),
    student_name: String(row.student_name ?? 'Anonymous Student'),
    phone: String(row.phone ?? '+254700000000'),
    email: typeof row.email === 'string' && row.email ? row.email : null,
    cluster_points:
      row.cluster_points !== null && row.cluster_points !== undefined
        ? Number(row.cluster_points)
        : null,
    mean_grade: typeof row.mean_grade === 'string' ? row.mean_grade : null,
    target_course: typeof row.target_course === 'string' ? row.target_course : null,
    financing_preference:
      typeof row.financing_preference === 'string'
        ? (row.financing_preference as UniversityLead['financing_preference'])
        : 'undecided',
    hef_band:
      row.hef_band !== null && row.hef_band !== undefined ? Number(row.hef_band) : null,
    source:
      typeof row.source === 'string'
        ? (row.source as UniversityLead['source'])
        : 'university_page',
    status: validStatus,
    consent: row.consent === false ? false : true,
    createdAt: String(row.createdAt ?? row.created_at ?? new Date().toISOString()),
  };
}

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

function MetricCard({
  label,
  value,
  subtitle,
  change,
}: {
  label: string;
  value: string | number;
  subtitle?: string;
  change?: number | null;
}) {
  const isUp = typeof change === 'number' && change > 0;
  const isFlat = change === 0 || change === null || change === undefined;
  return (
    <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
        {label}
      </div>
      <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-jetbrains), monospace', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: '0.85rem', fontWeight: 600, color: isFlat ? 'var(--text-tertiary)' : isUp ? 'var(--success-text)' : '#EF4444' }}>
        {subtitle ? (
          <span>{subtitle}</span>
        ) : (
          <>
            {isFlat ? <Minus size={14} /> : isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {isFlat ? '30-day rolling window' : `${isUp ? '+' : ''}${change}% vs prior 30d`}
          </>
        )}
      </div>
    </div>
  );
}

function OverviewTab({
  leads,
  metrics,
  onOpenLeads,
}: {
  leads: UniversityLead[];
  metrics: LeadMetrics;
  onOpenLeads: () => void;
}) {
  const maxCourseCount = Math.max(...metrics.topCourses.map(c => c.count), 1);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <h2 className="text-h2" style={{ margin: 0 }}>Dashboard Overview</h2>
        <button type="button" className="btn btn-gold btn-sm" onClick={onOpenLeads}>
          <Users size={15} /> Open Admissions Pipeline ({metrics.total})
        </button>
      </div>

      <div className="dashboard-grid-3" style={{ marginBottom: 32 }}>
        <MetricCard
          label="Prospective Enquiries"
          value={metrics.total}
          change={metrics.changePct}
          subtitle={`${metrics.byStatus.New} new • ${metrics.last30} in last 30 days`}
        />
        <MetricCard
          label="Avg KCSE Cluster Score"
          value={metrics.avgClusterPoints !== null ? `${metrics.avgClusterPoints} / 48` : '—'}
          subtitle="Self-reported across student enquiries"
        />
        <MetricCard
          label="Application Conversion"
          value={metrics.conversionPct !== null ? `${metrics.conversionPct}%` : '—'}
          subtitle={`${metrics.byStatus.Applied} Applied • ${metrics.byStatus.Enrolled} Enrolled`}
        />
      </div>

      <div className="dashboard-grid-2">
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, fontSize: '1.1rem' }}>
            Top Programmes by Student Demand
          </div>
          {metrics.topCourses.length === 0 ? (
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>No course enquiries recorded yet.</p>
          ) : (
            metrics.topCourses.map(({ course, count }) => {
              const pct = Math.round((count / maxCourseCount) * 100);
              return (
                <div key={course} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.9rem', gap: 12 }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{course}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    <div style={{ width: 90, height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: 'var(--accent-gold)', width: `${pct}%`, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                      {count} {count === 1 ? 'lead' : 'leads'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, fontSize: '1.1rem' }}>
            Recent Student Enquiries
          </div>
          {leads.slice(0, 4).map(lead => (
            <div key={lead.id} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border-light)', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: lead.status === 'Enrolled' ? 'var(--success-text)' : 'var(--accent-gold)',
                  flexShrink: 0,
                  marginTop: 6,
                }}
              />
              <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {lead.student_name} — <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{lead.target_course || 'General Admission'}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
                  {lead.mean_grade ? `Mean ${lead.mean_grade} • ` : ''}
                  {lead.cluster_points ? `${lead.cluster_points} pts • ` : ''}
                  {SOURCE_LABELS[lead.source]} • {formatRelativeTime(lead.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LeadsTab({
  uni,
  leads,
  loading,
  isDemoData,
  metrics,
  onStatusChange,
}: {
  uni: University;
  leads: UniversityLead[];
  loading: boolean;
  isDemoData: boolean;
  metrics: LeadMetrics;
  onStatusChange: (leadId: string, nextStatus: LeadStatus) => Promise<void>;
}) {
  const [stageFilter, setStageFilter] = useState<'All' | LeadStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredLeads = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return leads.filter(l => {
      if (stageFilter !== 'All' && l.status !== stageFilter) return false;
      if (!q) return true;
      return (
        l.student_name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        (l.target_course || '').toLowerCase().includes(q) ||
        (l.email || '').toLowerCase().includes(q)
      );
    });
  }, [leads, stageFilter, searchQuery]);

  const exportCSV = () => {
    const csvContent = leadsToCsv(filteredLeads);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `chuo_connect_leads_${uni.id}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const statusColor: Record<LeadStatus, string> = {
    New: 'var(--gold-primary)',
    Contacted: '#3B82F6',
    Applied: '#8B5CF6',
    Enrolled: 'var(--success-text)',
    'Not interested': 'var(--text-tertiary)',
  };

  const handleStageSelect = async (leadId: string, nextStatus: LeadStatus) => {
    setUpdatingId(leadId);
    await onStatusChange(leadId, nextStatus);
    setUpdatingId(null);
  };

  return (
    <div>
      <div className="dashboard-header" style={{ marginBottom: 18 }}>
        <div>
          <h2 className="text-h2" style={{ marginBottom: 4 }}>Admissions Lead Pipeline</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
            Qualify prospective students by KCSE cluster score, HEF funding tier, and programme choice, then reach out in 1 click via WhatsApp.
          </p>
        </div>
        <button type="button" className="btn btn-outline btn-sm" onClick={exportCSV}>
          <Download size={14} /> Export CSV ({filteredLeads.length})
        </button>
      </div>

      {isDemoData && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 12,
            background: 'var(--gold-glow)',
            border: '1px solid var(--border-medium)',
            marginBottom: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '0.84rem',
            color: 'var(--text-primary)',
          }}
        >
          <Sparkles size={16} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
          <span>
            <strong>Interactive Preview Pipeline:</strong> Showing sample student leads for <strong>{uni.name}</strong>. Live student enquiries submitted via the University Profile, Course Finder, or KUCCPS Calculator automatically appear here once <code>supabase_university_leads.sql</code> is applied.
          </span>
        </div>
      )}

      {/* Stage Filter Pills & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(['All', ...LEAD_STATUSES] as const).map(stage => {
            const count = stage === 'All' ? metrics.total : metrics.byStatus[stage];
            const active = stageFilter === stage;
            return (
              <button
                key={stage}
                type="button"
                onClick={() => setStageFilter(stage)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 999,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: active ? '2px solid var(--navy-deep)' : '1px solid var(--border-medium)',
                  background: active ? 'var(--navy-deep)' : 'var(--bg-primary)',
                  color: active ? '#FFFFFF' : 'var(--text-secondary)',
                }}
              >
                {stage} ({count})
              </button>
            );
          })}
        </div>

        <div style={{ position: 'relative', minWidth: 240, flex: '0 1 300px' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input
            type="search"
            placeholder="Search name, phone or course..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: 34, paddingTop: 8, paddingBottom: 8, fontSize: '0.85rem' }}
          />
        </div>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '820px', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-light)' }}>
            <tr>
              {['Student & Contact', 'KCSE & Cluster', 'Target Course & Funding', 'Stage', 'Direct Outreach'].map(h => (
                <th key={h} style={{ padding: '14px 18px', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: 32, textAlign: 'center', color: 'var(--text-tertiary)' }}>
                  <Loader2 size={24} className="animate-spin mx-auto" />
                </td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 32, textAlign: 'center', color: 'var(--text-tertiary)' }}>
                  No leads match the current filter.
                </td>
              </tr>
            ) : (
              filteredLeads.map(lead => {
                const links = buildContactLinks(lead, uni.name);
                const color = statusColor[lead.status] || 'var(--text-secondary)';
                return (
                  <tr key={lead.id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'var(--transition)' }} className="table-row-hover">
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                        {lead.student_name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-jetbrains), monospace', marginTop: 2 }}>
                        {lead.phone}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                        {SOURCE_LABELS[lead.source]} • {formatRelativeTime(lead.createdAt)}
                      </div>
                    </td>

                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                        {lead.cluster_points !== null ? `${lead.cluster_points.toFixed(1)} / 48` : '—'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                        Mean Grade: <strong>{lead.mean_grade || 'N/A'}</strong>
                      </div>
                    </td>

                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                        {lead.target_course || 'General Admission Enquiry'}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                        <span style={{ fontSize: '0.73rem', padding: '2px 8px', borderRadius: 6, background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                          {FINANCING_LABELS[lead.financing_preference]}
                        </span>
                        {lead.hef_band && (
                          <span style={{ fontSize: '0.73rem', padding: '2px 8px', borderRadius: 6, background: 'var(--gold-glow)', color: 'var(--gold-primary)', fontWeight: 700 }}>
                            HEF Band {lead.hef_band}
                          </span>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: '16px 18px' }}>
                      <select
                        aria-label={`Stage for ${lead.student_name}`}
                        value={lead.status}
                        disabled={updatingId === lead.id}
                        onChange={e => handleStageSelect(lead.id, e.target.value as LeadStatus)}
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color,
                          padding: '6px 10px',
                          background: `${color}15`,
                          border: '1px solid var(--border-medium)',
                          borderRadius: 8,
                          cursor: 'pointer',
                        }}
                      >
                        {LEAD_STATUSES.map(s => (
                          <option key={s} value={s} style={{ color: 'var(--text-primary)', background: 'var(--bg-primary)' }}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <a
                          href={links.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-gold btn-sm"
                          style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                          title="Message on WhatsApp with pre-filled admission greeting"
                        >
                          <MessageCircle size={14} /> WhatsApp
                        </a>
                        <a
                          href={links.tel}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                          title={`Call ${lead.phone}`}
                        >
                          <Phone size={14} /> Call
                        </a>
                        {links.mailto && (
                          <a
                            href={links.mailto}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                            title={`Email ${lead.email}`}
                          >
                            <Mail size={14} />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
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
    website: uni.website || '',
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
              <input id="students" className="form-input" value={formData.students} onChange={e => setFormData({ ...formData, students: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="fees">Estimated Fees per Year</label>
              <input id="fees" className="form-input" value={formData.fees} onChange={e => setFormData({ ...formData, fees: e.target.value })} />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: 24 }}>
            <label className="form-label" htmlFor="accommodation">Accommodation Description</label>
            <textarea id="accommodation" className="form-textarea" value={formData.accommodation} onChange={e => setFormData({ ...formData, accommodation: e.target.value })} rows={4} />
          </div>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.2rem', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-light)' }}>Media & Links</h3>
          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="form-label" htmlFor="virtualTourUrl">Virtual Tour URL</label>
            <input id="virtualTourUrl" className="form-input" value={formData.virtualTourUrl} onChange={e => setFormData({ ...formData, virtualTourUrl: e.target.value })} placeholder="https://youruniversity.edu/virtual-tour" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="website">University Website</label>
            <input id="website" className="form-input" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} placeholder="https://youruniversity.ac.ke" />
          </div>
          <div style={{ marginTop: 24 }}>
            <label className="form-label" style={{ display: 'block', marginBottom: 12 }}>Gallery Images</label>
            <div style={{ border: '2px dashed var(--border-medium)', borderRadius: 'var(--radius-lg)', padding: '48px', textAlign: 'center', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'var(--transition)', background: 'var(--bg-secondary)' }} className="upload-zone">
              <UploadCloud size={40} style={{ margin: '0 auto 12px', color: 'var(--accent-gold)' }} />
              <div style={{ fontWeight: 600, marginBottom: 8, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Drag and drop images here</div>
              <div style={{ fontWeight: 400, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>PNG, JPG up to 5MB each · Max 20 images</div>
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
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} size={16} fill={idx < r.rating ? 'var(--accent-gold)' : 'transparent'} color={idx < r.rating ? 'var(--accent-gold)' : 'var(--border-medium)'} />
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
  const [leads, setLeads] = useState<UniversityLead[]>(() => buildDemoLeads(uni.id));
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [isDemoData, setIsDemoData] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let active = true;
    async function loadLeads() {
      setLoadingLeads(true);
      const { data, error } = await supabase
        .from('university_leads')
        .select('*')
        .eq('universityId', uni.id)
        .order('createdAt', { ascending: false });

      if (!active) return;
      if (!error && Array.isArray(data) && data.length > 0) {
        setLeads(data.map(r => normalizeDbRow(r as Record<string, unknown>, uni.id)));
        setIsDemoData(false);
      } else {
        setLeads(buildDemoLeads(uni.id));
        setIsDemoData(true);
      }
      setLoadingLeads(false);
    }
    loadLeads();
    return () => {
      active = false;
    };
  }, [uni.id, supabase]);

  const metrics = useMemo(() => computeLeadMetrics(leads), [leads]);

  const handleStatusChange = async (leadId: string, nextStatus: LeadStatus) => {
    setLeads(prev => prev.map(l => (l.id === leadId ? { ...l, status: nextStatus } : l)));
    if (!isDemoData) {
      await supabase.from('university_leads').update({ status: nextStatus }).eq('id', leadId);
    }
  };

  return (
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
          {activeTab === 'overview' && (
            <OverviewTab
              leads={leads}
              metrics={metrics}
              onOpenLeads={() => setActiveTab('leads')}
            />
          )}
          {activeTab === 'analytics' && <AnalyticsTab metrics={metrics} />}
          {activeTab === 'leads' && (
            <LeadsTab
              uni={uni}
              leads={leads}
              loading={loadingLeads}
              isDemoData={isDemoData}
              metrics={metrics}
              onStatusChange={handleStatusChange}
            />
          )}
          {activeTab === 'profile' && <ProfileEditorTab uni={uni} />}
          {activeTab === 'reviews' && <ReviewsTab />}
        </div>
      </main>
    </div>
  );
}
