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
   ANIMATIONS
   ───────────────────────────────────────────── */

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.6 + i * 0.08 },
  }),
};

const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 },
  },
};

export default function HeroSection() {
  return (
    <section style={{ padding: '0 20px 20px', background: '#FFFFFF' }}>
      <div
        style={{
          position: 'relative',
          minHeight: 'calc(100vh - 84px)',
          display: 'flex',
          alignItems: 'center',
          overflow: 'clip',
          borderRadius: 20,
          border: '2px solid var(--navy-deep)',
          boxShadow: '6px 6px 0px var(--navy-deep)',
          background: '#FAFAF8',
        }}
      >
        {/* Dot grid texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, var(--navy-deep) 0.8px, transparent 0.8px)',
            backgroundSize: '28px 28px',
            opacity: 0.04,
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
            {/* Eyebrow tag */}
            <motion.div variants={fadeUp}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 14px 5px 6px',
                  borderRadius: 10,
                  border: '2px solid var(--navy-deep)',
                  background: '#FFF',
                  boxShadow: '2px 2px 0px var(--navy-deep)',
                  marginBottom: 28,
                }}
              >
                <span
                  style={{
                    background: 'var(--gold-primary)',
                    color: 'var(--navy-deep)',
                    fontWeight: 800,
                    fontSize: '0.65rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: 6,
                  }}
                >
                  NEW
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy-deep)' }}>
                  2026 KUCCPS intake is live
                </span>
              </div>
            </motion.div>

            {/* Headline — marketing-focused */}
            <motion.h1
              variants={fadeUp}
              style={{
                fontSize: 'clamp(2.4rem, 4.8vw, 3.8rem)',
                fontWeight: 700,
                lineHeight: 1.06,
                letterSpacing: '-0.03em',
                color: 'var(--navy-deep)',
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
                  transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: 'absolute',
                    bottom: 2,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'var(--gold-primary)',
                    borderRadius: 2,
                    transformOrigin: 'left',
                    opacity: 0.3,
                  }}
                />
              </span>
            </motion.h1>

            {/* Sub — sells the value, not the features */}
            <motion.p
              variants={fadeUp}
              style={{
                marginTop: 20,
                fontSize: 'clamp(0.95rem, 1.3vw, 1.08rem)',
                fontWeight: 450,
                lineHeight: 1.65,
                color: 'var(--text-secondary)',
                maxWidth: 440,
              }}
            >
              Compare every university, course, and student review in Kenya. 
              Get matched to your best-fit campus in minutes — not months.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              style={{
                marginTop: 32,
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <Link
                href="/universities"
                className="btn btn-gold"
                style={{
                  padding: '14px 28px',
                  fontSize: '0.95rem',
                  borderRadius: 14,
                }}
              >
                Explore Universities
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/calculator"
                className="btn btn-outline"
                style={{
                  padding: '14px 28px',
                  fontSize: '0.95rem',
                  borderRadius: 14,
                }}
              >
                <GraduationCap size={16} />
                Check My Points
              </Link>
            </motion.div>

            {/* Social proof strip */}
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
                  style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      border: '2px solid var(--navy-deep)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--gold-glow)',
                    }}
                  >
                    <item.icon size={16} style={{ color: 'var(--navy-deep)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy-deep)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                      {item.value}
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.02em' }}>
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
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: '35%',
                bottom: '18%',
                borderRadius: 16,
                border: '2px solid var(--navy-deep)',
                boxShadow: '4px 4px 0px var(--navy-deep)',
                overflow: 'hidden',
                zIndex: 2,
              }}
            >
              <Image
                src="/images/hero-campus.jpg"
                alt="Modern university campus"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* Stacked side images */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                top: '8%',
                right: 0,
                width: '38%',
                aspectRatio: '3/4',
                borderRadius: 14,
                border: '2px solid var(--navy-deep)',
                boxShadow: '3px 3px 0px var(--navy-deep)',
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
                padding: '8px 10px',
                background: 'linear-gradient(transparent, rgba(26,35,56,0.85))',
              }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff', letterSpacing: '0.03em' }}>
                  Strathmore
                </span>
              </div>
            </motion.div>

            {/* Bottom wide image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: '5%',
                right: '10%',
                height: '30%',
                borderRadius: 14,
                border: '2px solid var(--navy-deep)',
                boxShadow: '3px 3px 0px var(--navy-deep)',
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
                padding: '8px 12px',
                background: 'linear-gradient(transparent, rgba(26,35,56,0.85))',
              }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff', letterSpacing: '0.03em' }}>
                  University of Nairobi
                </span>
              </div>
            </motion.div>

            {/* Floating review card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
              whileInView={{
                y: [0, -6, 0],
                transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              }}
              style={{
                position: 'absolute',
                bottom: '35%',
                right: '-5%',
                background: '#fff',
                border: '2px solid var(--navy-deep)',
                boxShadow: '4px 4px 0px var(--navy-deep)',
                borderRadius: 14,
                padding: '14px 18px',
                zIndex: 10,
                maxWidth: 200,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <TrendingUp size={14} style={{ color: 'var(--gold-primary)' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--navy-deep)' }}>Trending Now</span>
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Computer Science at JKUAT — most searched this week
              </div>
            </motion.div>

            {/* Location pin */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
              whileInView={{
                y: [0, -4, 0],
                transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
              }}
              style={{
                position: 'absolute',
                top: '5%',
                right: '42%',
                background: 'var(--gold-primary)',
                border: '2px solid var(--navy-deep)',
                borderRadius: 10,
                padding: '6px 10px',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <MapPin size={12} style={{ color: 'var(--navy-deep)' }} />
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--navy-deep)', letterSpacing: '0.02em' }}>
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
        transition={{ duration: 0.6, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 32,
          flexWrap: 'wrap',
          padding: '20px 0 0',
        }}
      >
        {['KUCCPS Aligned', 'Free for Students', '100% Verified Reviews'].map((badge) => (
          <div
            key={badge}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--text-tertiary)',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            <CheckCircle size={14} style={{ color: 'var(--gold-primary)' }} />
            {badge}
          </div>
        ))}
      </motion.div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            padding: 60px 20px 40px !important;
            gap: 40px !important;
          }
          .hero-image-grid {
            min-height: 320px !important;
          }
        }
        @media (max-width: 600px) {
          .hero-image-grid {
            min-height: 260px !important;
          }
        }
      `}</style>
    </section>
  );
}
