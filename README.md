<div align="center">
  <img src="public/logos/Chuo_Connect_Logo_Primary.svg" alt="Chuo Connect Logo" width="180"/>
  
  <br><br>

  <a href="https://chuoconnectkenya.vercel.app/">
    <img src="https://readme-typing-svg.herokuapp.com?font=Inter&weight=600&size=24&pause=1000&color=1D4ED8;EAB308;4338CA;F59E0B&center=true&vCenter=true&width=600&lines=The+Premier+University+Discovery+Platform;Automated+KUCCPS+Cluster+Calculation;Premium+Student+Housing+Integration;Built+for+Kenyan+Students" alt="Typing SVG" />
  </a>

  <br>

  [![Vercel Deployment](https://therealsujitk-vercel-badge.vercel.app/?app=chuoconnectkenya)](https://chuoconnectkenya.vercel.app/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-000000?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](https://opensource.org/licenses/MIT)

</div>

<br>

<div align="center">
  <img src="public/hero-screenshot.png" alt="Chuo Connect Live Preview" width="850" style="border-radius: 12px; border: 1px solid #e2e8f0;"/>
</div>

<br>

<div align="center">

<a href="#overview"><kbd> <br> Overview <br> </kbd></a>&ensp;&ensp;
<a href="#features"><kbd> <br> Features <br> </kbd></a>&ensp;&ensp;
<a href="#architecture"><kbd> <br> Architecture <br> </kbd></a>&ensp;&ensp;
<a href="#installation"><kbd> <br> Installation <br> </kbd></a>&ensp;&ensp;
<a href="CONTRIBUTING.md"><kbd> <br> Contributing <br> </kbd></a>&ensp;&ensp;
<a href="https://chuoconnectkenya.vercel.app/"><kbd> <br> Live Demo <br> </kbd></a>

</div><br><br>

<div align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,supabase,postgres,vercel,nodejs,git,github,vscode&perline=11" />
  </a>
</div>

<br>

<a id="overview"></a>
<img src="https://readme-typing-svg.herokuapp.com?font=Inter&weight=600&size=25&pause=1000&color=1D4ED8;F59E0B&vCenter=true&width=435&height=25&lines=EXECUTIVE+OVERVIEW;PLATFORM+SUMMARY" width="450"/>

---

**Chuo Connect** is an enterprise-grade web platform engineered to bridge the gap between Kenyan students and higher education institutions. By delivering a highly optimized, unified ecosystem, Chuo Connect empowers users to navigate university admissions, calculate KUCCPS cluster points dynamically, and secure verified housing.

Designed with a strict, neo-brutalist aesthetic and built on a high-performance modern web stack, it delivers an unparalleled, secure experience for students, partners, and institutions.

<br>

<a id="features"></a>
<img src="https://readme-typing-svg.herokuapp.com?font=Inter&weight=600&size=25&pause=1000&color=1D4ED8;F59E0B&vCenter=true&width=435&height=25&lines=CORE+INFRASTRUCTURE;KEY+FEATURES" width="450"/>

---

<table>
  <tr>
    <td width="50%">
      <h3><img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/graduation-cap.svg" width="20" height="20" align="center"/> Institutional Discovery</h3>
      Aggregated, verified analytics and programmatic discovery for top-tier Kenyan universities (UoN, KU, JKUAT, Strathmore) leveraging structured relational data.
    </td>
    <td width="50%">
      <h3><img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/calculator.svg" width="20" height="20" align="center"/> Automated KUCCPS Engine</h3>
      A proprietary calculation engine executing real-time cluster point analytics based on standardized high school grading schemas.
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3><img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/building-2.svg" width="20" height="20" align="center"/> Verified Housing Portal</h3>
      End-to-end housing discovery featuring exclusive listings from Qwetu, Qejani, and certified private developers.
    </td>
    <td width="50%">
      <h3><img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield-check.svg" width="20" height="20" align="center"/> Enterprise Security</h3>
      Strict Row-Level Security (RLS), JWT-based authentication, and protected API endpoints powered by Supabase Auth.
    </td>
  </tr>
</table>

<br>

<a id="architecture"></a>
<img src="https://readme-typing-svg.herokuapp.com?font=Inter&weight=600&size=25&pause=1000&color=1D4ED8;F59E0B&vCenter=true&width=435&height=25&lines=ARCHITECTURE+%26+STACK;TECH+FOUNDATION" width="450"/>

---

Chuo Connect is deployed on a highly scalable, edge-first architecture to guarantee uncompromising performance and developer velocity.

<details>
<summary><strong>View Frontend Architecture</strong></summary>
<br>

- **Framework**: `Next.js 16` (App Router)
- **Language**: `TypeScript` (Strict configuration)
- **Styling**: `Tailwind CSS v4` (Custom neo-brutalist design tokens)
- **Icons**: `Lucide React`
- **Animations**: `Framer Motion` for high-fidelity micro-interactions
</details>

<details>
<summary><strong>View Backend Infrastructure</strong></summary>
<br>

- **Database**: `Supabase` (PostgreSQL)
- **Authentication**: `Supabase Auth` (Role-Based Access Control)
- **Hosting**: `Vercel` (Edge CDN & Serverless Compute)
- **Security Protocols**: HTTP Security Headers (HSTS, X-Frame-Options), RLS Database Isolation
</details>

<br>

<a id="installation"></a>
<img src="https://readme-typing-svg.herokuapp.com?font=Inter&weight=600&size=25&pause=1000&color=1D4ED8;F59E0B&vCenter=true&width=435&height=25&lines=INSTALLATION;GET+STARTED" width="450"/>

---

> [!IMPORTANT]
> Ensure you have an active Supabase project and Node.js v26.x+ installed before initializing the local engine.

### 1. Repository Setup
```bash
git clone https://github.com/maneziezra/chuoconnectkenya.git
cd chuoconnectkenya
npm install
```

### 2. Environment Configuration
Create a `.env.local` file at the root to securely connect the Edge network to the Database.
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Initialize Engine
```bash
npm run dev
```
Execute the application locally at `http://localhost:3000`.

<br>

<a id="security"></a>
<img src="https://readme-typing-svg.herokuapp.com?font=Inter&weight=600&size=25&pause=1000&color=1D4ED8;F59E0B&vCenter=true&width=435&height=25&lines=SECURITY+%26+COMPLIANCE;ENTERPRISE+GRADE" width="450"/>

---

Data integrity and user isolation are enforced rigorously:
- **Zero-Trust Access**: APIs require strict bearer token verification.
- **Row-Level Security (RLS)**: Enforced via PostgreSQL policies restricting table manipulation exclusively to authenticated identities.
- **Header Hardening**: Implemented via `next.config.ts` mitigating XSS and MIME-sniffing vulnerabilities.

---

<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/copyright.svg" width="16" height="16" align="center"/> 2026 Chuo Connect. All rights reserved.
</div>
