import type { Metadata } from 'next';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | Chuo Connect Kenya',
  description: 'Get in touch with the Chuo Connect Kenya team. We help students, universities, and partners connect.',
};

export default function ContactPage() {
  return (
    <>
      <div style={{ padding: '40px 20px', background: '#FAFAF8' }}>
        <div
          style={{
            background: '#FFFFFF',
            border: '2px solid var(--navy-deep)',
            borderRadius: 20,
            boxShadow: '6px 6px 0px var(--navy-deep)',
            padding: '60px 40px',
            maxWidth: 1000,
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle, var(--navy-deep) 0.8px, transparent 0.8px)',
              backgroundSize: '28px 28px',
              opacity: 0.04,
              pointerEvents: 'none'
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 className="text-h1" style={{ color: 'var(--navy-deep)', marginBottom: 12 }}>Get In Touch</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 480 }}>
              Have a question, partnership inquiry, or feedback? We&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </div>

      <section className="section" style={{ background: '#FAFAF8' }}>
        <div className="container" style={{ maxWidth: 1000 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 48 }}>
            {/* Contact Info */}
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: 'var(--navy-deep)', marginBottom: 24 }}>Contact Information</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 40 }}>
                {[
                  { icon: <Mail size={24} />, label: 'Email', value: 'hello@chuoconnect.co.ke', href: 'mailto:hello@chuoconnect.co.ke' },
                  { icon: <Phone size={24} />, label: 'Phone', value: '+254 700 000 000', href: 'tel:+254700000000' },
                  { icon: <MapPin size={24} />, label: 'Location', value: 'Nairobi, Kenya', href: undefined },
                ].map(c => (
                  <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        border: '2px solid var(--navy-deep)',
                        borderRadius: 10,
                        background: 'var(--gold-glow)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: 'var(--navy-deep)',
                        boxShadow: '2px 2px 0px var(--navy-deep)'
                      }}
                    >
                      {c.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: 4 }}>{c.label}</div>
                      {c.href ? (
                        <a href={c.href} style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--navy-deep)', textDecoration: 'none' }}>{c.value}</a>
                      ) : (
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--navy-deep)' }}>{c.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  padding: 32,
                  background: '#FFFFFF',
                  borderRadius: 16,
                  border: '2px solid var(--navy-deep)',
                  boxShadow: '4px 4px 0px var(--navy-deep)'
                }}
              >
                <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--navy-deep)', marginBottom: 12 }}>Are you a University?</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
                  Join our partner programme to showcase your campus to thousands of students. Get a dedicated profile, analytics, and lead management.
                </p>
                <a href="/portal" className="btn btn-navy">Partner With Us</a>
              </div>
            </div>

            {/* Contact Form */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 20,
                padding: 40,
                border: '2px solid var(--navy-deep)',
                boxShadow: '6px 6px 0px var(--navy-deep)'
              }}
            >
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: 'var(--navy-deep)', marginBottom: 24 }}>Send a Message</h2>
              <form style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--navy-deep)', display: 'block', marginBottom: 8 }}>First Name</label>
                    <input
                      placeholder="John"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid var(--navy-deep)',
                        borderRadius: 10,
                        fontSize: '1rem',
                        outline: 'none',
                        background: '#FAFAF8'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--navy-deep)', display: 'block', marginBottom: 8 }}>Last Name</label>
                    <input
                      placeholder="Kamau"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid var(--navy-deep)',
                        borderRadius: 10,
                        fontSize: '1rem',
                        outline: 'none',
                        background: '#FAFAF8'
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--navy-deep)', display: 'block', marginBottom: 8 }}>Email</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid var(--navy-deep)',
                      borderRadius: 10,
                      fontSize: '1rem',
                      outline: 'none',
                      background: '#FAFAF8'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--navy-deep)', display: 'block', marginBottom: 8 }}>Subject</label>
                  <select
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid var(--navy-deep)',
                      borderRadius: 10,
                      fontSize: '1rem',
                      outline: 'none',
                      background: '#FAFAF8',
                      cursor: 'pointer'
                    }}
                  >
                    <option>General Enquiry</option>
                    <option>University Partnership</option>
                    <option>Submit a Scholarship</option>
                    <option>Submit an Event</option>
                    <option>List Student Housing</option>
                    <option>Student Ambassador Programme</option>
                    <option>Technical Support</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--navy-deep)', display: 'block', marginBottom: 8 }}>Message</label>
                  <textarea
                    placeholder="Tell us how we can help…"
                    rows={5}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid var(--navy-deep)',
                      borderRadius: 10,
                      fontSize: '1rem',
                      outline: 'none',
                      resize: 'vertical' as const,
                      background: '#FAFAF8'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-navy"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginTop: 8,
                    padding: '16px'
                  }}
                >
                  <MessageCircle size={18} /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
