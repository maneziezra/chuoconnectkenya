'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Star } from 'lucide-react';
import type { LeadMetrics } from '@/lib/utils/leads';

export default function PartnerAnalyticsTab({ metrics }: { metrics: LeadMetrics }) {
  const chartData = metrics.clusterBuckets.map(b => ({
    name: b.name,
    enquiries: b.count,
  }));

  const topBucket = [...metrics.clusterBuckets].sort((a, b) => b.count - a.count)[0];
  const totalLeads = Math.max(metrics.total, 1);

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginBottom: 24, fontSize: '1.5rem' }}>
        Enquiry & Audience Analytics
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 12, padding: 24 }}>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            Enquiries by KCSE Cluster Points
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 16 }}>
            Self-reported weighted cluster scores across {metrics.total} student enquiries
          </div>
          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-medium)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} dy={10} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <Tooltip
                  cursor={{ fill: 'rgba(26, 35, 56, 0.04)' }}
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="enquiries" fill="var(--navy-deep)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: 16 }}>
            <Star size={14} style={{ color: 'var(--gold-primary)' }} aria-hidden="true" />
            {topBucket && topBucket.count > 0
              ? `Highest volume from students in the ${topBucket.name} cluster-point range (${topBucket.count})`
              : 'Cluster score distribution updates automatically as students submit enquiries'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 12, padding: 24 }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
              Enquiries by Acquisition Channel
            </div>
            {metrics.bySource.map(item => {
              const pct = metrics.total > 0 ? Math.round((item.count / totalLeads) * 100) : 0;
              return (
                <div key={item.key} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                      {item.count} ({pct}%)
                    </span>
                  </div>
                  <div style={{ height: 8, background: 'var(--bg-tertiary)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'var(--gold-primary)', borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 12, padding: 24 }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
              Student Financing Preferences
            </div>
            {metrics.byFinancing.map(item => {
              const pct = metrics.total > 0 ? Math.round((item.count / totalLeads) * 100) : 0;
              return (
                <div key={item.key} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                      {item.count} ({pct}%)
                    </span>
                  </div>
                  <div style={{ height: 8, background: 'var(--bg-tertiary)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'var(--navy-deep)', borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
