# Chuo Connect Kenya — Production Build Plan

## Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Vanilla CSS (Executive Navy & Gold design system) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Deployment | Vercel |
| State | React Context + Server Components |

---

## App Router Structure

```
src/
├── app/
│   ├── (marketing)/          # Public landing & browse pages
│   │   ├── page.tsx          # Homepage (hero, features, stats)
│   │   ├── universities/     # Browse all universities
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx # Individual campus profile
│   │   ├── courses/page.tsx  # Browse courses
│   │   └── guidance/page.tsx # Career & KUCCPS guidance
│   │
│   ├── (auth)/               # Auth flows
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   │
│   ├── (student)/            # Protected student features
│   │   ├── dashboard/page.tsx         # Personalized student dashboard
│   │   ├── recommendations/page.tsx  # KUCCPS calculator + results
│   │   └── favourites/page.tsx       # Saved universities & courses
│   │
│   ├── (university)/         # Protected university partner features
│   │   └── portal/
│   │       ├── page.tsx       # Overview (metrics)
│   │       ├── analytics/page.tsx
│   │       ├── leads/page.tsx
│   │       ├── profile/page.tsx
│   │       └── reviews/page.tsx
│   │
│   ├── api/                  # API Routes
│   │   ├── universities/route.ts
│   │   ├── courses/route.ts
│   │   └── recommendations/route.ts
│   │
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Executive Navy & Gold design system
│
├── components/
│   ├── ui/                   # Reusable primitive components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Modal.tsx
│   ├── university/
│   │   ├── UniversityCard.tsx
│   │   ├── CampusProfile.tsx
│   │   └── ReviewEngine.tsx
│   ├── student/
│   │   ├── KuccpsCalculator.tsx
│   │   ├── FavouritesGrid.tsx
│   │   └── GradeInput.tsx
│   ├── portal/
│   │   ├── MetricCard.tsx
│   │   ├── LeadsTable.tsx
│   │   └── AnalyticsChart.tsx
│   └── layout/
│       ├── Navbar.tsx
│       └── Footer.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Browser Supabase client
│   │   └── server.ts         # Server Supabase client
│   ├── types/
│   │   └── index.ts          # TypeScript types for University, Course, Student, Review
│   ├── data/
│   │   └── universities.ts   # Seed data (migrated from prototype)
│   └── utils/
│       └── kuccps.ts         # KUCCPS formula utility
```

---

## Supabase Database Schema

```sql
-- Universities table
universities (id, name, abbrev, type, county, ranking, students, fees, 
              accommodation, facilities, image_url, virtual_tour_url, ...)

-- Courses table  
courses (id, title, cluster_group, min_points, duration, description, 
         university_ids[], ...)

-- Reviews table
reviews (id, university_id, user_id, type, rating, body, criteria_scores, 
         created_at, ...)

-- Student profiles table
student_profiles (id, user_id, kcse_grade, cluster_points, 
                  favourite_universities[], favourite_courses[], ...)

-- University partners table
university_partners (id, university_id, user_id, role, access_code, ...)
```

---

## Build Order (Phase by Phase)

### Phase A: Foundation
1. ✅ Scaffold Next.js project
2. [ ] Set up `globals.css` with design system tokens
3. [ ] Build `Navbar` and `Footer` components
4. [ ] Build reusable `Button`, `Card`, `Badge` components

### Phase B: Marketing Site
5. [ ] Build Homepage (hero, features, stats sections)
6. [ ] Build Universities browse page
7. [ ] Build individual Campus Profile page `[id]`

### Phase C: Supabase Integration
8. [ ] Create Supabase project & tables
9. [ ] Migrate university dataset from prototype to Supabase
10. [ ] Connect pages to live Supabase data

### Phase D: Student Features
11. [ ] Auth (signup/login pages)
12. [ ] Student Dashboard
13. [ ] KUCCPS Recommendation Engine
14. [ ] Favourites system

### Phase E: University Partner Portal
15. [ ] University partner auth & role gating
16. [ ] Portal overview (metrics)
17. [ ] Leads pipeline, analytics, profile editor, reviews tabs

---

## Open Questions
> [!IMPORTANT]
> **Do you have a Supabase account?** We will need to create a project there to get the database URL and API keys. If yes, do you have them ready?
> 
> **Do you have a domain name?** (e.g. `chuoconnect.co.ke`) This is optional for now but needed for Vercel deployment later.
