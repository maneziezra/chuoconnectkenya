'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Star, TrendingUp, Compass, Award } from 'lucide-react';
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
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', fontSize: '1.65rem', fontWeight: 700, letterSpacing: '-0.028em', margin: '0 0 6px 0' }}>
          Enquiry & Audience Analytics
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          Real-time intelligence on KCSE cluster points, student demand channels, and household funding demographics.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        {/* Main Bar Chart */}
        <div
          style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-light)',
            borderTop: '1px solid var(--apple-glass-highlight)',
            borderRadius: 'var(--radius-xl)',
            padding: 28,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem', letterSpacing: '-0.015em' }}>
                Enquiries by KCSE Cluster Score
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                Self-reported 48-point weighted cluster scores across {metrics.total} students
              </div>
            </div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--gold-primary)',
                background: 'var(--gold-glow)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              <TrendingUp size={12} /> Cluster Distribution
            </span>
          </div>

          <div style={{ height: 270, width: '100%', marginTop: 20 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 12, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--gold-primary)" stopOpacity={1} />
                    <stop offset="100%" stopColor="var(--gold-primary)" stopOpacity={0.45} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                  dy={10}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(199, 155, 55, 0.08)' }}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-primary)',
                    boxShadow: 'var(--shadow-md)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                  itemStyle={{ color: 'var(--gold-primary)' }}
                />
                <Bar dataKey="enquiries" fill="url(#barGradient)" radius={[8, 8, 2, 2]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              marginTop: 18,
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
            }}
          >
            <Star size={15} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} aria-hidden="true" />
            <span>
              {topBucket && topBucket.count > 0
                ? `Highest demand from students in the ${topBucket.name} cluster-point range (${topBucket.count} applicants)`
                : 'Cluster score distribution updates automatically as students submit enquiries'}
            </span>
          </div>
        </div>

        {/* Breakdown Columns */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Acquisition Channel Breakdown */}
          <div
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-light)',
              borderTop: '1px solid var(--apple-glass-highlight)',
              borderRadius: 'var(--radius-xl)',
              padding: 28,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Compass size={18} style={{ color: 'var(--gold-primary)' }} />
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem', letterSpacing: '-0.015em' }}>
                Enquiries by Lead Channel
              </div>
            </div>
            {metrics.bySource.map(item => {
              const pct = metrics.total > 0 ? Math.round((item.count / totalLeads) * 100) : 0;
              return (
                <div key={item.key} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{item.label}</span>
                    <span className="tabular-nums" style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>
                      {item.count} ({pct}%)
                    </span>
                  </div>
                  <div style={{ height: 8, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: 'var(--gold-primary)',
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Student Financing Preferences */}
          <div
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-light)',
              borderTop: '1px solid var(--apple-glass-highlight)',
              borderRadius: 'var(--radius-xl)',
              padding: 28,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Award size={18} style={{ color: 'var(--gold-primary)' }} />
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem', letterSpacing: '-0.015em' }}>
                Funding & Fee Band Demographics
              </div>
            </div>
            {metrics.byFinancing.map((item, idx) => {
              const pct = metrics.total > 0 ? Math.round((item.count / totalLeads) * 100) : 0;
              const barColors = ['var(--brand-navy)', 'var(--gold-primary)', 'var(--success-text)', 'var(--info-text)'];
              const color = barColors[idx % barColors.length];
              return (
                <div key={item.key} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{item.label}</span>
                    <span className="tabular-nums" style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>
                      {item.count} ({pct}%)
                    </span>
                  </div>
                  <div style={{ height: 8, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: color,
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 0.5s ease',
                      }}
                    />
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
