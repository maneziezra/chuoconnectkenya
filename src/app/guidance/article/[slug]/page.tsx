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
    title: `${article.title} | Chuo Connect Kenya`,
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
      <div style={{ background: 'var(--navy-deep)', padding: '64px 0 40px', borderBottom: '4px solid var(--gold-primary)' }}>
        <div className="container">
          <Link 
            href="/guidance" 
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: 6, 
              color: 'rgba(255,255,255,0.7)', textDecoration: 'none', 
              fontSize: '0.9rem', marginBottom: 32, fontWeight: 500,
              transition: 'var(--transition)'
            }}
            className="hover-text-gold"
          >
            <ArrowLeft size={16} /> Back to Guidance Hub
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, background: 'rgba(199,155,55,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)' }}>
              {article.icon}
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--gold-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={14} /> {article.readTime}
            </span>
          </div>

          <h1 className="text-h1" style={{ color: 'white', marginBottom: 16, maxWidth: 800 }}>
            {article.title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', maxWidth: 700, lineHeight: 1.6 }}>
            {article.desc}
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="article-content" style={{ maxWidth: 800, margin: '0 auto', color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8 }}>
            {article.content}
          </div>
        </div>
      </section>

      {/* Inline styles for article content since we don't have a global article class */}
      <style dangerouslySetInnerHTML={{__html: `
        .article-content h2 {
          color: var(--navy-deep);
          font-family: 'Playfair Display', serif;
          font-size: 1.75rem;
          margin-top: 48px;
          margin-bottom: 16px;
        }
        .article-content h2:first-child {
          margin-top: 0;
        }
        .article-content p {
          margin-bottom: 24px;
        }
        .article-content ul {
          margin-bottom: 24px;
          padding-left: 24px;
        }
        .article-content li {
          margin-bottom: 12px;
        }
        .article-content strong {
          color: var(--navy-deep);
        }
        .hover-text-gold:hover {
          color: var(--gold-primary) !important;
        }
      `}} />
    </>
  );
}
