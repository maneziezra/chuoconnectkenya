'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Star } from 'lucide-react';

const CHART_DATA = [
  { name: 'Below 25', interest: 20 },
  { name: '25-30', interest: 45 },
  { name: '30-35', interest: 85 },
  { name: '35-40', interest: 100 },
  { name: '40-48', interest: 60 },
];

export default function PartnerAnalyticsTab() {
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-playfair), serif', color: 'var(--navy-deep)', marginBottom: 24, fontSize: '1.5rem' }}>
        Audience Analytics
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 12, padding: 24 }}>
          <div style={{ fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 20 }}>Interest by KCSE Cluster Points</div>
          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-medium)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(26, 35, 56, 0.04)' }} 
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="interest" fill="var(--navy-deep)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: 16 }}>
            <Star size={14} style={{ color: 'var(--gold-primary)' }} aria-hidden="true" /> Highest interest from students scoring 35-40 cluster points
          </div>
        </div>

        <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 12, padding: 24 }}>
          <div style={{ fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 20 }}>Visitor Breakdown</div>
          {[
            { label: 'Students (KCSE Leavers)', pct: 68, color: 'var(--navy-deep)' },
            { label: 'Parents / Guardians', pct: 22, color: 'var(--gold-primary)' },
            { label: 'School Counsellors', pct: 10, color: 'var(--success-text)' },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                <span style={{ fontWeight: 700, color: 'var(--navy-deep)', fontFamily: 'var(--font-jetbrains), monospace' }}>{item.pct}%</span>
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
