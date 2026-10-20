'use client';

import { useState } from 'react';
import { MessageCircle, CheckCircle2, AlertCircle, Loader2, Mail, Phone } from 'lucide-react';

export default function ContactFormClient() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('University Partnership');
  const [organization, setOrganization] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!fullName || !email.trim() || !message.trim()) {
      setError('Please enter your name, email address, and message.');
      return;
    }

    setSubmitting(true);
    try {
      const normalizedPhone = phone.trim() || '0700000000';
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          university_id: 'chuo-connect-partnerships',
          university_name: organization.trim() || 'Chuo Connect Kenya Partnerships',
          course_interest: subject,
          student_name: fullName,
          email: email.trim(),
          phone: normalizedPhone,
          message: `[${subject}] ${organization ? `(${organization}) ` : ''}${message.trim()}`,
          source: 'university_page',
          consent_given: true,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Could not submit inquiry. Please check your phone/email format.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Could not submit message.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const waText = encodeURIComponent(
      `Hi Chuo Connect Kenya Team! My name is ${fullName}${organization ? ` from ${organization}` : ''}. Subject: ${subject}. ${message}`
    );
    const mailSubject = encodeURIComponent(`[Chuo Connect] ${subject} — ${fullName}`);
    const mailBody = encodeURIComponent(
      `Name: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nOrganization: ${organization || 'N/A'}\nSubject: ${subject}\n\n${message}`
    );

    return (
      <div style={{ textAlign: 'center', padding: '24px 8px' }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'var(--success-bg)',
            color: 'var(--success-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            border: '2px solid var(--border-medium)',
          }}
        >
          <CheckCircle2 size={32} />
        </div>
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
          Message Received!
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 24 }}>
          Thank you, <strong>{fullName}</strong>. Your <strong>{subject}</strong> inquiry has been logged with our partnerships & student support desk. We respond within 2 business hours.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          <a
            href={`https://wa.me/254700000000?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Phone size={16} /> Fast-Track on WhatsApp Now
          </a>
          <a
            href={`mailto:hello@chuoconnect.co.ke?subject=${mailSubject}&body=${mailBody}`}
            className="btn btn-outline"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Mail size={16} /> Open in Email Client
          </a>
        </div>

        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setMessage('');
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-tertiary)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {error && (
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 10,
            background: 'var(--danger-bg)',
            color: 'var(--danger-text)',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
            First Name *
          </label>
          <input
            required
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            placeholder="John"
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '2px solid var(--border-medium)',
              borderRadius: 10,
              fontSize: '0.95rem',
              outline: 'none',
              background: 'var(--bg-secondary)',
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
            Last Name *
          </label>
          <input
            required
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            placeholder="Kamau"
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '2px solid var(--border-medium)',
              borderRadius: 10,
              fontSize: '0.95rem',
              outline: 'none',
              background: 'var(--bg-secondary)',
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
            Email Address *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="john@example.com"
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '2px solid var(--border-medium)',
              borderRadius: 10,
              fontSize: '0.95rem',
              outline: 'none',
              background: 'var(--bg-secondary)',
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
            Phone / WhatsApp *
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="0712 345 678"
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '2px solid var(--border-medium)',
              borderRadius: 10,
              fontSize: '0.95rem',
              outline: 'none',
              background: 'var(--bg-secondary)',
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
            Subject
          </label>
          <select
            value={subject}
            onChange={e => setSubject(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '2px solid var(--border-medium)',
              borderRadius: 10,
              fontSize: '0.95rem',
              outline: 'none',
              background: 'var(--bg-secondary)',
              cursor: 'pointer',
            }}
          >
            <option value="University Partnership">University B2B Partnership</option>
            <option value="List Student Housing">List Student Hostel / Housing</option>
            <option value="Submit a Scholarship">Sponsor / Submit a Scholarship</option>
            <option value="Submit an Event">List Campus Open Day / Event</option>
            <option value="General Enquiry">Student Admissions Enquiry</option>
            <option value="Student Ambassador Programme">Student Ambassador Application</option>
            <option value="Technical Support">Technical Support</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
            Institution / Hostel (Optional)
          </label>
          <input
            value={organization}
            onChange={e => setOrganization(e.target.value)}
            placeholder="e.g. Strathmore / Qwetu"
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '2px solid var(--border-medium)',
              borderRadius: 10,
              fontSize: '0.95rem',
              outline: 'none',
              background: 'var(--bg-secondary)',
            }}
          />
        </div>
      </div>

      <div>
        <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
          Message *
        </label>
        <textarea
          required
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Tell us about your university partnership goals, hostel listing, or student inquiry…"
          rows={4}
          style={{
            width: '100%',
            padding: '12px 14px',
            border: '2px solid var(--border-medium)',
            borderRadius: 10,
            fontSize: '0.95rem',
            outline: 'none',
            resize: 'vertical',
            background: 'var(--bg-secondary)',
          }}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-navy"
        style={{
          width: '100%',
          justifyContent: 'center',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 4,
          padding: '14px 16px',
        }}
      >
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Sending Message…
          </>
        ) : (
          <>
            <MessageCircle size={18} /> Send Message
          </>
        )}
      </button>
    </form>
  );
}
