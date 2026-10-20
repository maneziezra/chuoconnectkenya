import type { MetadataRoute } from 'next';
import { GRADE_GUIDES } from '@/lib/data/gradeGuides';
import { universitiesData } from '@/lib/data/universities';
import { ARTICLES } from '@/lib/data/articles';

const BASE_URL = 'https://chuoconnectkenya.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/calculator`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/grades`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/universities`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/courses`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/scholarships`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/housing`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/compare`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/guidance`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/events`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const gradeRoutes: MetadataRoute.Sitemap = GRADE_GUIDES.map(g => ({
    url: `${BASE_URL}/grades/${g.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const universityRoutes: MetadataRoute.Sitemap = universitiesData.map(u => ({
    url: `${BASE_URL}/universities/${u.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const articleRoutes: MetadataRoute.Sitemap = ARTICLES.map(a => ({
    url: `${BASE_URL}/guidance/article/${a.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  return [...staticRoutes, ...gradeRoutes, ...universityRoutes, ...articleRoutes];
}
