import { ARTICLES } from '@/lib/data/articles';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await params;
  const article = ARTICLES.find(a => a.slug === p.slug);
  
  if (!article) return { title: 'Article Not Found' };
  
  return {
    title: article.title,
    description: article.desc,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params;
  const article = ARTICLES.find(a => a.slug === p.slug);
  
  if (!article) {
    notFound();
  }

  return (
    <>
      {/* ── HERO BANNER ── */}
      <div style={{ padding: '32px 20px 0', background: 'var(--bg-secondary)' }}>
        <div
          style={{
            background: 'var(--apple-glass-bg)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-light)',
            borderTop: '1px solid var(--apple-glass-highlight)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-md)',
            padding: '48px 36px',
            maxWidth: 1040,
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Link 
              href="/guidance" 
              style={{ 
                display: 'inline-flex', alignItems: 'center', gap: 6, 
                color: 'var(--text-secondary)', textDecoration: 'none', 
                fontSize: '0.88rem', marginBottom: 24, fontWeight: 600,
                transition: 'var(--transition)'
              }}
              className="hover-text-gold"
            >
              <ArrowLeft size={16} /> Back to Guidance Hub
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: 'var(--gold-glow)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  borderTop: '1px solid var(--apple-glass-highlight)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-primary)',
                }}
              >
                {article.icon}
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--gold-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={14} /> {article.readTime}
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                fontWeight: 800,
                letterSpacing: '-0.035em',
                lineHeight: 1.15,
                color: 'var(--text-primary)',
                marginBottom: 14,
                maxWidth: 860,
              }}
            >
              {article.title}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 740, lineHeight: 1.6, margin: 0 }}>
              {article.desc}
            </p>
          </div>
        </div>
      </div>

      <section className="section" style={{ background: 'var(--bg-secondary)', padding: '48px 20px 80px' }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <div
            style={{
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-light)',
              borderTop: '1px solid var(--apple-glass-highlight)',
              boxShadow: 'var(--shadow-sm)',
              padding: '48px 40px',
            }}
          >
            <div className="article-content" style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8 }}>
              {article.content}
            </div>
          </div>
        </div>
      </section>

      {/* Inline styles for article content */}
      <style dangerouslySetInnerHTML={{__html: `
        .article-content h2 {
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-weight: 700;
          letter-spacing: -0.025em;
          font-size: 1.6rem;
          margin-top: 40px;
          margin-bottom: 16px;
        }
        .article-content h2:first-child {
          margin-top: 0;
        }
        .article-content p {
          margin-bottom: 20px;
        }
        .article-content ul {
          margin-bottom: 20px;
          padding-left: 24px;
        }
        .article-content li {
          margin-bottom: 10px;
        }
        .article-content strong {
          color: var(--text-primary);
          font-weight: 700;
        }
        .hover-text-gold:hover {
          color: var(--gold-primary) !important;
        }
      `}} />
    </>
  );
}
