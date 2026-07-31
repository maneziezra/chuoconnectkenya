<div align="center">
  <img src="public/logos/Chuo_Connect_Logo_Primary.svg" alt="Chuo Connect Logo" width="200"/>
  <h1>Chuo Connect Kenya</h1>
  <p><strong>The Premier University Discovery & Housing Platform for Kenyan Students</strong></p>

  [![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=chuoconnectkenya)](https://chuoconnectkenya.vercel.app/)
  [![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)](https://supabase.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
</div>

<hr />

## 📖 Overview

**Chuo Connect** is a cutting-edge platform designed to bridge the gap between Kenyan students and higher education institutions. By providing a streamlined, intuitive interface, Chuo Connect empowers students to discover universities, calculate KUCCPS cluster points, and secure verified student housing in a single unified ecosystem.

Designed with a premium neo-brutalist aesthetic and built on a high-performance modern web stack, Chuo Connect delivers an enterprise-grade experience for both students and institutional partners.

---

## ✨ Core Features

- 🎓 **Comprehensive University Discovery**: Browse verified data for top Kenyan universities (UoN, KU, JKUAT, Strathmore, etc.).
- 🧮 **Automated KUCCPS Calculator**: Intelligent cluster point calculation based on high school grades.
- 🏢 **Premium Student Housing**: Integrated housing discovery with verified listings from Qwetu, Qejani, and private landlords.
- 🔐 **Secure Role-Based Access**: Complete authentication and Row-Level Security powered by Supabase.
- ⚡ **Blazing Fast Performance**: Statically generated and server-rendered pages using Next.js 16.
- 🎨 **Enterprise Design System**: A bespoke, highly-polished user interface with seamless micro-interactions and Framer Motion animations.

---

## 🏗️ Architecture & Tech Stack

Chuo Connect is built on a scalable, modern architecture to ensure optimal performance, security, and developer velocity.

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with a custom design system
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

### Backend & Infrastructure
- **Database**: [Supabase (PostgreSQL)](https://supabase.com/)
- **Authentication**: Supabase Auth (JWT & Role-Based Access Control)
- **Hosting**: [Vercel](https://vercel.com/) (Edge Network)
- **Security**: Strict HTTP Headers, RLS Policies, Route Protection

---

## 🚀 Getting Started

### Prerequisites
- Node.js 26.x or later
- npm or pnpm
- A Supabase Project

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/maneziezra/chuoconnectkenya.git
   cd chuoconnectkenya
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your Supabase keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security

Security is a first-class citizen in Chuo Connect. We enforce strict data protection policies, including:
- **Row Level Security (RLS)**: Enforced at the database level to ensure data isolation.
- **API Route Protection**: Secure API endpoints that reject unauthenticated requests.
- **Strict Headers**: Mitigation against XSS, Clickjacking, and MIME-sniffing via `next.config.ts`.

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for detailed information on our development process.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<div align="center">
  <sub>Built with ❤️ for Kenyan Students</sub>
</div>
