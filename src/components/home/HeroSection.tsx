'use client';

import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, GraduationCap, CheckCircle, Users, BookOpen, MapPin, TrendingUp } from 'lucide-react';

/* ─────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────── */

const SOCIAL_PROOF = [
  { value: '70+', label: 'Universities', icon: BookOpen },
  { value: '2,500+', label: 'Courses', icon: GraduationCap },
  { value: '10K+', label: 'Students', icon: Users },
];

/* ─────────────────────────────────────────────
   APPLE SPRING ANIMATIONS (Law 4 & 5)
   Critically damped spring: [0.16, 1, 0.3, 1]
   ───────────────────────────────────────────── */

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.5 + i * 0.08 },
  }),
};

const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 },
  },
};

export default function HeroSection() {
  return (
    <section style={{ padding: '0 20px 20px', background: 'var(--bg-primary)' }}>
      <div
        className="hero-container"
        style={{
          position: 'relative',
          minHeight: 'calc(100vh - 84px)',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-light)',
          borderTop: '1px solid var(--apple-glass-highlight)',
          boxShadow: '0 20px 48px -12px rgba(26, 35, 56, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
          background: 'var(--bg-secondary)',
        }}
      >
        {/* Subtle dot grid texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, var(--navy-deep) 0.8px, transparent 0.8px)',
            backgroundSize: '28px 28px',
            opacity: 0.035,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Content grid */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: 1360,
            margin: '0 auto',
            padding: '80px 40px 60px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 60,
            alignItems: 'center',
          }}
          className="hero-grid"
        >
          {/* ── LEFT: Text ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            {/* Eyebrow tag: Apple glass pill */}
            <motion.div variants={fadeUp}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 14px 5px 6px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-light)',
                  borderTop: '1px solid var(--apple-glass-highlight)',
                  background: 'var(--apple-glass-bg)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: 'var(--shadow-sm)',
                  marginBottom: 28,
                }}
              >
                <span
                  style={{
                    background: 'var(--gold-primary)',
                    color: 'var(--gold-contrast-text)',
                    fontWeight: 800,
                    fontSize: '0.65rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  NEW
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                  2026 KUCCPS intake is live
                </span>
              </div>
            </motion.div>

            {/* Headline — Law 15: Optical Sizing (-0.032em) */}
            <motion.h1
              variants={fadeUp}
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 700,
                lineHeight: 1.06,
                letterSpacing: '-0.032em',
                color: 'var(--text-primary)',
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Your future starts{' '}
              <br />
              with the right{' '}
              <span
                style={{
                  color: 'var(--gold-primary)',
                  position: 'relative',
                  display: 'inline-block',
                }}
              >
                campus
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: 'absolute',
                    bottom: 2,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'var(--gold-primary)',
                    borderRadius: 'var(--radius-sm)',
                    transformOrigin: 'left',
                    opacity: 0.35,
                  }}
                />
              </span>
            </motion.h1>

            {/* Subtitle — comfortable body leading (1.62) */}
            <motion.p
              variants={fadeUp}
              style={{
                marginTop: 20,
                fontSize: 'clamp(0.98rem, 1.3vw, 1.1rem)',
                fontWeight: 450,
                lineHeight: 1.62,
                color: 'var(--text-secondary)',
                maxWidth: 460,
                letterSpacing: '-0.005em',
              }}
            >
              Compare every university, course, and student review in Kenya. 
              Get matched to your best-fit campus in minutes — not months.
            </motion.p>

            {/* CTAs — Law 1 & 10: Instant Tactile Feedback */}
            <motion.div
              variants={fadeUp}
              style={{
                marginTop: 32,
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <motion.div whileTap={{ scale: 0.975 }} transition={{ duration: 0.08 }}>
                <Link
                  href="/universities"
                  className="btn btn-gold"
                  style={{
                    padding: '14px 28px',
                    fontSize: '0.95rem',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  Explore Universities
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </motion.div>
              <motion.div whileTap={{ scale: 0.975 }} transition={{ duration: 0.08 }}>
                <Link
                  href="/calculator"
                  className="btn btn-outline"
                  style={{
                    padding: '14px 28px',
                    fontSize: '0.95rem',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <GraduationCap size={16} aria-hidden="true" />
                  Check My Points
                </Link>
              </motion.div>
            </motion.div>

            {/* Social proof strip — Squircle icons & optical numbers */}
            <motion.div
              variants={fadeUp}
              style={{
                marginTop: 44,
                display: 'flex',
                gap: 32,
                flexWrap: 'wrap',
              }}
            >
              {SOCIAL_PROOF.map((item, i) => (
                <motion.div
                  key={item.label}
                  custom={i}
                  variants={scaleIn}
                  initial="hidden"
                  animate="show"
                  style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      borderTop: '1px solid var(--apple-glass-highlight)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--bg-primary)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <item.icon size={19} style={{ color: 'var(--accent-gold)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-0.025em' }}>
                      {item.value}
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {item.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Image Collage ── */}
          <motion.div
            variants={imageReveal}
            initial="hidden"
            animate="show"
            style={{
              position: 'relative',
              height: '100%',
              minHeight: 480,
            }}
            className="hero-image-grid"
          >
            {/* Main large image */}
            <div
              className="hero-main-img"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: '35%',
                bottom: '18%',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                borderTop: '1px solid var(--apple-glass-highlight)',
                boxShadow: '0 20px 40px -10px rgba(26, 35, 56, 0.16)',
                overflow: 'hidden',
                zIndex: 2,
              }}
            >
              <Image
                src="/images/hero-campus.jpg"
                alt="Modern university campus"
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 900px) 100vw, 40vw"
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* Stacked side image */}
            <motion.div
              className="hero-collage-item"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                top: '8%',
                right: 0,
                width: '38%',
                aspectRatio: '3/4',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                borderTop: '1px solid var(--apple-glass-highlight)',
                boxShadow: '0 16px 32px -8px rgba(26, 35, 56, 0.14)',
                overflow: 'hidden',
                zIndex: 3,
              }}
            >
              <Image
                src="/images/universities/strath.jpg"
                alt="Strathmore University"
                fill
                sizes="20vw"
                style={{ objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '10px 12px',
                background: 'linear-gradient(transparent, rgba(17, 24, 39, 0.88))',
              }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.02em' }}>
                  Strathmore
                </span>
              </div>
            </motion.div>

            {/* Bottom wide image */}
            <motion.div
              className="hero-collage-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: '5%',
                right: '10%',
                height: '30%',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                borderTop: '1px solid var(--apple-glass-highlight)',
                boxShadow: '0 16px 32px -8px rgba(26, 35, 56, 0.14)',
                overflow: 'hidden',
                zIndex: 4,
              }}
            >
              <Image
                src="/images/universities/uon.jpg"
                alt="University of Nairobi"
                fill
                sizes="30vw"
                style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '10px 14px',
                background: 'linear-gradient(transparent, rgba(17, 24, 39, 0.88))',
              }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.02em' }}>
                  University of Nairobi
                </span>
              </div>
            </motion.div>

            {/* Floating review card — Apple Translucent Glass */}
            <motion.div
              className="hero-collage-item"
              initial={{ opacity: 0, scale: 0.85, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
              whileInView={{
                y: [0, -6, 0],
                transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
              }}
              style={{
                position: 'absolute',
                bottom: '35%',
                right: '-5%',
                background: 'var(--apple-glass-bg)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                border: '1px solid var(--border-light)',
                borderTop: '1px solid var(--apple-glass-highlight)',
                boxShadow: '0 20px 40px -10px rgba(11, 17, 32, 0.18)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 18px',
                zIndex: 10,
                maxWidth: 210,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <TrendingUp size={14} aria-hidden="true" style={{ color: 'var(--gold-primary)' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>Trending Now</span>
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                Computer Science at JKUAT — most searched this week
              </div>
            </motion.div>

            {/* Location pin pill */}
            <motion.div
              className="hero-collage-item"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
              whileInView={{
                y: [0, -4, 0],
                transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
              }}
              style={{
                position: 'absolute',
                top: '5%',
                right: '42%',
                background: 'var(--gold-primary)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 12px',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                boxShadow: '0 6px 16px rgba(199, 155, 55, 0.35)',
              }}
            >
              <MapPin size={12} aria-hidden="true" style={{ color: 'var(--gold-contrast-text)' }} />
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--gold-contrast-text)', letterSpacing: '0.03em' }}>
                47 Counties
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Trust bar below hero island */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 32,
          flexWrap: 'wrap',
          padding: '22px 0 4px',
        }}
      >
        {['KUCCPS Aligned', 'Free for Students', '100% Verified Reviews'].map((badge) => (
          <div
            key={badge}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              color: 'var(--text-tertiary)',
              fontSize: '0.82rem',
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            <CheckCircle size={15} aria-hidden="true" style={{ color: 'var(--gold-primary)' }} />
            {badge}
          </div>
        ))}
      </motion.div>

      <style>{`
        @media (max-width: 900px) {
          .hero-container {
            align-items: flex-start !important;
            height: auto !important;
          }
          .hero-grid {
            grid-template-columns: 1fr !important;
            padding: 40px 18px 32px !important;
            gap: 32px !important;
          }
          .hero-image-grid {
            min-height: 280px !important;
            height: 280px !important;
          }
          .hero-collage-item {
            display: none !important;
          }
          .hero-main-img {
            right: 0 !important;
            bottom: 0 !important;
            box-shadow: 0 12px 28px -6px rgba(0, 0, 0, 0.15) !important;
          }
        }
        @media (max-width: 600px) {
          .hero-image-grid {
            min-height: 240px !important;
            height: 240px !important;
          }
        }
      `}</style>
    </section>
  );
}
