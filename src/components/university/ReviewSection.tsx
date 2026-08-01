'use client';

import { useState } from 'react';
import { Star, Send, CheckCircle, ChevronUp, Check, PenLine } from 'lucide-react';
import type { Review } from '@/lib/types';

const CRITERIA = [
  { key: 'academic', label: 'Academic Quality' },
  { key: 'environment', label: 'Campus Environment' },
  { key: 'accommodation', label: 'Accommodation' },
  { key: 'facilities', label: 'Facilities' },
  { key: 'safety', label: 'Safety' },
  { key: 'support', label: 'Support Services' },
  { key: 'studentLife', label: 'Student Life' },
];

interface Props {
  universityId: string;
  initialReviews: Review[];
}

export default function ReviewSection({ universityId, initialReviews }: Props) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    authorName: '',
    body: '',
    overallRating: 0,
    criteriaScores: {} as Record<string, number>,
  });

  const handleStarClick = (field: string, val: number) => {
    if (field === 'overall') setForm(f => ({ ...f, overallRating: val }));
    else setForm(f => ({ ...f, criteriaScores: { ...f.criteriaScores, [field]: val } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.body || form.overallRating === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ universityId, ...form }),
      });
      if (res.ok) {
        const newReview = await res.json();
        setReviews(prev => [newReview, ...prev]);
        setSubmitted(true);
        setShowForm(false);
      }
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="card card-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-light)' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', fontWeight: 600, color: 'var(--navy-deep)' }}>
          Student Reviews
        </h2>
        {!submitted && (
          <button onClick={() => setShowForm(!showForm)} className="btn btn-navy btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {showForm ? <><ChevronUp size={14} /> Hide Form</> : <><Send size={14} /> Write a Review</>}
          </button>
        )}
        {submitted && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--gold-primary)', fontWeight: 600 }}>
            <CheckCircle size={16} /> Review submitted!
          </span>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{
          background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)',
          padding: 24, marginBottom: 28, border: '1px solid var(--border-light)',
        }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--text-tertiary)', display: 'block', marginBottom: 8 }}>Your Name</label>
            <input
              value={form.authorName}
              onChange={e => setForm(f => ({ ...f, authorName: e.target.value }))}
              placeholder="e.g. John Kamau"
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border-light)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', background: 'var(--bg-primary)', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--text-tertiary)', display: 'block', marginBottom: 8 }}>Overall Rating</label>
            <StarRatingInput value={form.overallRating} onChange={val => handleStarClick('overall', val)} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--text-tertiary)', display: 'block', marginBottom: 12 }}>Rate by Category (Optional)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {CRITERIA.map(c => (
                <div key={c.key}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{c.label}</div>
                  <StarRatingInput value={form.criteriaScores[c.key] ?? 0} onChange={val => handleStarClick(c.key, val)} size="sm" />
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--text-tertiary)', display: 'block', marginBottom: 8 }}>Your Review</label>
            <textarea
              value={form.body}
              onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
              placeholder="Share your experience at this campus — what you love, challenges you faced, tips for new students…"
              rows={5}
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border-light)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', background: 'var(--bg-primary)', outline: 'none', resize: 'vertical' as const }}
            />
          </div>

          <button type="submit" className="btn btn-gold" disabled={submitting || !form.body || form.overallRating === 0}>
            {submitting ? 'Submitting…' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {reviews.map(r => (
            <div key={r.id} style={{ paddingBottom: 20, borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--navy-deep)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {r.authorName || 'Anonymous'}
                    {r.verified && <span style={{ fontSize: '0.7rem', background: 'var(--success-bg)', color: 'var(--success-text)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}><Check size={10} /> Verified</span>}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                    {new Date(r.createdAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'long' })}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={14} fill={s <= r.overallRating ? 'var(--gold-primary)' : 'none'} stroke={s <= r.overallRating ? 'none' : 'var(--border-medium)'} />
                  ))}
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{r.body}</p>
              {r.criteriaScores && Object.keys(r.criteriaScores).length > 0 && (
                <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {CRITERIA.filter(c => r.criteriaScores?.[c.key as keyof typeof r.criteriaScores]).map(c => (
                    <span key={c.key} style={{ fontSize: '0.75rem', padding: '3px 10px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', color: 'var(--text-secondary)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {c.label}: {r.criteriaScores![c.key as keyof typeof r.criteriaScores]} <Star size={10} fill="var(--text-secondary)" color="var(--text-secondary)" />
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-tertiary)' }}>
          <PenLine size={48} style={{ margin: '0 auto 12px', color: 'var(--text-tertiary)', display: 'block' }} />
          <p>No reviews yet. Be the first to share your experience!</p>
        </div>
      )}
    </div>
  );
}

function StarRatingInput({ value, onChange, size = 'md' }: { value: number; onChange: (v: number) => void; size?: 'sm' | 'md' }) {
  const [hover, setHover] = useState(0);
  const s = size === 'sm' ? 16 : 22;
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
        >
          <Star size={s} fill={star <= (hover || value) ? 'var(--gold-primary)' : 'none'} stroke={star <= (hover || value) ? 'none' : 'var(--border-medium)'} />
        </button>
      ))}
    </div>
  );
}
