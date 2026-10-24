'use client';

import { useState } from 'react';
import { MessageCircle, Send, Zap, Check, GraduationCap } from 'lucide-react';
import type { Ambassador } from '@/lib/types';

function getDefaultAmbassadors(universityId: string): Ambassador[] {
  return [
    {
      id: `amb-${universityId}-1`,
      universityId,
      userId: `amb-user-${universityId}-1`,
      name: 'Faith Chebet',
      course: 'BSc. Computer Science',
      year: '3',
      bio: 'Happy to answer questions about first-year orientation, HEF/HELB bursary clearance, and safe student hostels near main gate.',
      topics: ['Accommodation', 'HEF & HELB', 'Tech Clubs', 'First-Year Tips'],
      responseTime: 'Replies within 2 hrs',
    },
    {
      id: `amb-${universityId}-2`,
      universityId,
      userId: `amb-user-${universityId}-2`,
      name: 'David Omondi',
      course: 'Bachelor of Commerce (Finance)',
      year: '4',
      bio: 'Student council peer mentor. Ask me about inter-faculty transfers, attachment placements, and campus sports.',
      topics: ['Course Transfers', 'Attachments', 'Campus Life', 'Budgeting'],
      responseTime: 'Replies within 4 hrs',
    },
  ];
}

interface Props {
  universityId: string;
  initialAmbassadors: Ambassador[];
}

export default function AmbassadorSection({ universityId, initialAmbassadors }: Props) {
  const [ambassadors] = useState<Ambassador[]>(
    initialAmbassadors.length > 0 ? initialAmbassadors : getDefaultAmbassadors(universityId)
  );
  const [selectedAmbassador, setSelectedAmbassador] = useState<Ambassador | null>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<string | null>(null);

  const handleSend = async (ambassador: Ambassador) => {
    if (!message.trim()) return;
    setSending(true);
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ambassadorId: ambassador.id, body: message }),
      });
      setSent(ambassador.id);
      setMessage('');
      setSelectedAmbassador(null);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="card card-body">
      <h2 style={{
        fontFamily: 'var(--font-sans)', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em',
        color: 'var(--text-primary)', marginBottom: 8, paddingBottom: 12,
        borderBottom: '1px solid var(--border-light)',
      }}>
        Student Ambassadors
      </h2>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
        Current students ready to answer your questions about daily life, accommodation, clubs, and more.
      </p>

      {ambassadors.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {ambassadors.map(amb => (
            <div key={amb.id} style={{
              background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)', overflow: 'hidden',
            }}>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                    background: 'var(--brand-navy)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.15rem', fontWeight: 700, color: 'var(--gold-primary)',
                  }}>
                    {amb.avatar ? (
                      <img src={amb.avatar} alt={amb.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : amb.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{amb.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 2 }}>{amb.course} · Year {amb.year}</div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.6 }}>{amb.bio}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                      {amb.topics?.map(t => (
                        <span key={t} style={{
                          fontSize: '0.75rem', padding: '3px 10px', background: 'var(--gold-glow)',
                          color: 'var(--text-primary)', borderRadius: 'var(--radius-full)',
                          border: '1px solid rgba(199,155,55,0.2)', fontWeight: 500,
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', paddingTop: 12, borderTop: '1px solid var(--border-light)' }}>
                  {amb.responseTime ? (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}><Zap size={11} style={{ color: 'var(--gold-primary)' }} /> {amb.responseTime}</span>
                  ) : <span />}
                  {sent === amb.id ? (
                    <span style={{ fontSize: '0.8rem', color: 'var(--success-text)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><Check size={14} /> Message sent!</span>
                  ) : (
                    <button
                      onClick={() => setSelectedAmbassador(selectedAmbassador?.id === amb.id ? null : amb)}
                      className="btn btn-navy btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <MessageCircle size={13} />
                      {selectedAmbassador?.id === amb.id ? 'Close' : 'Ask a Question'}
                    </button>
                  )}
                </div>
              </div>

              {selectedAmbassador?.id === amb.id && (
                <div style={{ padding: '0 20px 20px' }}>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder={`Ask ${amb.name} about accommodation, campus life, clubs, transport…`}
                    rows={3}
                    style={{
                      width: '100%', padding: '12px 14px', border: '1.5px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)', fontSize: '0.875rem', background: 'var(--bg-primary)',
                      outline: 'none', resize: 'vertical' as const,
                    }}
                  />
                  <button
                    onClick={() => handleSend(amb)}
                    disabled={sending || !message.trim()}
                    className="btn btn-gold btn-sm"
                    style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Send size={13} /> {sending ? 'Sending…' : 'Send Message'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-tertiary)' }}>
          <GraduationCap size={48} style={{ margin: '0 auto 12px', color: 'var(--text-tertiary)', display: 'block' }} />
          <p>No ambassadors listed yet for this campus.</p>
          <p style={{ fontSize: '0.85rem', marginTop: 8 }}>Are you a current student? <a href="/signup" style={{ color: 'var(--gold-primary)' }}>Become an ambassador</a></p>
        </div>
      )}
    </div>
  );
}
