# Chuo Connect Kenya — Project Master Notes & Specifications

**Document Version:** 1.0  
**Project Budget Tier:** $10,000 Premium Executive Web Application  
**Target Audience:** KCSE Candidates, High School Graduates, Diploma/Transfer Students, Parents, Universities, and TVET Colleges across Kenya.

---

## 🎨 1. Executive Visual Identity & Color System

The client mandates a **$10,000 executive aesthetic** governed by the **Executive Navy & Gold (Daylight Edition)** style guide:

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                     DAYLIGHT EDITION COLOR PALETTE                     │
 ├────────────────────────────┬────────────────────────────┬──────────────┤
 │ PRIMARY BACKGROUND         │ STRUCTURAL ANCHOR          │ PREMIUM ACCENT│
 │ Clean White & Light Surfaces│ Executive Navy            │ Rich Gold    │
 │ #FFFFFF / #F8FAFC          │ #1A2338 / #111827          │ #C79B37      │
 └────────────────────────────┴────────────────────────────┴──────────────┘
```

### Color Token Specifications & Component Application:
* **Clean White & Light Surfaces (`#FFFFFF` / `#F8FAFC`):** The primary canvas. Layered administrative data cards rest on a clean white surface with soft ambient lighting interactions and precise sharp edges to maintain 'academic authority'.
* **Executive Navy (`#1A2338`):** The foundational anchor used for deep structure, headers, footers, graph lines, and primary text (Deep Slate/Near-Black) to ensure high-contrast readability against the light background.
* **Rich Gold (`#C79B37`):** The gleaming premium accent used for official seals, key focal points, active states, and metric highlights.

### Typography Scale & Font Tokens:
Strictly adhering to the light background rule for maximum contrast and prestige:
* **Editorial / Hero Headlines:** `Instrument Serif` / `Playfair Display` — *Conveys academic authority and prestige in headers.*
* **Body Text & Interactive UI:** `Inter` / `Plus Jakarta Sans` — *Clean, modern readability.*
* **Data / Charts / Cluster Scores:** `JetBrains Mono` — *Emphasizes scientific precision in data visualizations and metrics.*

---

## 🎯 2. Core Platform Objectives & Feature Requirements

All 8 core features from the Executive Summary and Build Description are fully specified for implementation:

1. **Campus Discovery Engine:**
   * Browse and filter 70+ institutions by County (47 counties), Institution Type (Public / Private), Degree Level (Bachelors / Diploma / Certificate), Fee Range, and Available Facilities.
2. **Comprehensive Campus Profiles:**
   * 5-Tab full-screen modal per institution: Overview, Academic Programs offered, Facilities (labs, libraries, sports), Housing & Accommodation options, Contact Info & Map location.
3. **Smart Search System:**
   * Instant, real-time multi-keyword search across course names, university names, counties, career fields, and fees without page refreshes.
4. **Side-by-Side Campus & Course Comparison:**
   * Bottom sticky Compare Dock sliding up when 2-3 items are selected, leading to a comprehensive side-by-side comparison modal table.
5. **Dual Review Engine (University Students & Consumer/Parent Reviews):**
   * **Student Reviews Module:**
     * Verified current student badges with year of study and faculty.
     * Criteria evaluated: Academic Quality & Lecturer Support (1-5★), Campus Culture & Social Life (1-5★), Accommodation & Amenities (1-5★), Campus Safety & Security (1-5★), Sports & Extra-Curriculars (1-5★).
   * **Consumer, Parent & Alumni Reviews Module:**
     * Verified parent, employer, and alumnus badges.
     * Criteria evaluated: Administrative Efficiency & Speed (1-5★), Fee Transparency & Value for Money (1-5★), Graduate Employability & Career Outcomes (1-5★), Institutional Reliability (1-5★).
   * **Aggregate Metrics & Recommendation Score:**
     * Overall Institutional Rating out of 5.0.
     * Star distribution breakdown (5-star down to 1-star).
     * Recommendation Percentage (e.g., "89% of students & parents recommend this campus").
6. **Campus Gallery & Monogram System:**
   * **Images:** Must use extremely relevant, high-quality images for each university, specifically themed around "AI", technology, or highly relevant academic scenes.
   * HD video embeds, 360° virtual tours, plus a code-generated **Deterministic University Monogram System** (rendering custom color gradients and initials for unphotographed institutions).
7. **Student Ambassador Hub:**
   * Direct Q&A modal connecting prospective candidates with verified student ambassadors across faculties.
8. **Automated AI Campus & Cluster Matcher:**
   * Calculates candidate weighted cluster points ($w = \sqrt{\frac{4}{7} \cdot r \cdot R}$) and lists matching eligible courses based on 2024 indicative cut-offs.

---

## 📐 3. Mathematical Precision: KUCCPS Cluster Formula

The platform implements the official KUCCPS weighted cluster formula:

$$w = \sqrt{\frac{r}{m} \cdot \frac{R}{M}} \cdot 48 = \sqrt{\frac{4}{7} \cdot r \cdot R}$$

* **$R$ (Candidate Aggregate Points):** Best 7 KCSE subjects out of 84 (3 Compulsory Core + 2 Sciences + 1 Humanities + 1 Best Remaining).
* **$r$ (Cluster Subject Points):** 4 course-specific cluster subjects out of 48.
* **Eligibility Rules Checked:**
  1. $\text{Mean Grade} \ge \text{Minimum Course Requirement}$ (e.g. C+)
  2. $\text{Specific Subject Grades} \ge \text{Subject Prerequisites}$ (e.g. B- in Math)
  3. $w \ge \text{Indicative Course Cut-off Point}$

9. **Career & University Guidance Hub:**
   * **Section Header:** "Career & University Guidance"
   * **Subtitle:** "Expert advice to help you make informed decisions about your academic future."
   * **Topic Filter Categories:**
     1. `All`
     2. `Course Selection`
     3. `KUCCPS Guide`
     4. `Finances`
     5. `Rankings`
   * **Article Engine:** Full-screen modal reader with structured editorial guides, read times, category pills, and actionable takeaways for students.

| Domain / Objective | Regulatory Authority / Primary Source | Web Portal |
| :--- | :--- | :--- |
| **University Accreditation** | Commission for University Education (CUE) | `cue.or.ke` |
| **TVET Institutions** | TVET Authority (TVETA) | `tveta.go.ke` |
| **Placement & Cut-offs** | KUCCPS | `students.kuccps.net` |
| **Student Financing** | Higher Education Financing (HEF) | `hef.co.ke` |
| **Loans & Upkeep** | Higher Education Loans Board (HELB) | `helb.co.ke` |
| **Professional Accreditations** | EBK, CLE, KMPDC, NCK | Official Board Portals |
| **Qualifications Framework** | KNQA | `knqa.go.ke` |

---

## 🏫 6. Master Register: All 70 Accredited Universities in Kenya

### A. Public Chartered Universities (31)
1. **University of Nairobi (UoN)** — Nairobi (`uonbi.ac.ke`)
2. **Kenyatta University (KU)** — Kiambu / Nairobi (`ku.ac.ke`)
3. **Jomo Kenyatta University of Agriculture & Technology (JKUAT)** — Kiambu (`jkuat.ac.ke`)
4. **Moi University (MU)** — Uasin Gishu (`mu.ac.ke`)
5. **Egerton University (EU)** — Nakuru (`egerton.ac.ke`)
6. **Technical University of Kenya (TUK)** — Nairobi (`tukenya.ac.ke`)
7. **Technical University of Mombasa (TUM)** — Mombasa (`tum.ac.ke`)
8. **Maseno University (MSU)** — Kisumu (`maseno.ac.ke`)
9. **Masinde Muliro University of Science & Technology (MMUST)** — Kakamega (`mmust.ac.ke`)
10. **Dedan Kimathi University of Technology (DeKUT)** — Nyeri (`dkut.ac.ke`)
11. **Chuka University** — Tharaka Nithi (`chuka.ac.ke`)
12. **Kisii University** — Kisii (`kisiiuniversity.ac.ke`)
13. **Maasai Mara University** — Narok (`mmarau.ac.ke`)
14. **Meru University of Science & Technology (MUST)** — Meru (`must.ac.ke`)
15. **Multimedia University of Kenya (MMU)** — Nairobi (`mmu.ac.ke`)
16. **Pwani University** — Kilifi (`pu.ac.ke`)
17. **South Eastern Kenya University (SEKU)** — Kitui (`seku.ac.ke`)
18. **University of Eldoret (UoE)** — Uasin Gishu (`uoeld.ac.ke`)
19. **University of Kabianga (UoK)** — Kericho (`kabianga.ac.ke`)
20. **Karatina University** — Nyeri (`karu.ac.ke`)
21. **Kibabii University** — Bungoma (`kibu.ac.ke`)
22. **Laikipia University** — Laikipia (`laikipia.ac.ke`)
23. **Machakos University** — Machakos (`mksu.ac.ke`)
24. **Rongo University** — Migori (`rongovarsity.ac.ke`)
25. **Taita Taveta University** — Taita Taveta (`ttu.ac.ke`)
26. **Murang'a University of Technology (MUT)** — Murang'a (`mut.ac.ke`)
27. **University of Embu** — Embu (`embuni.ac.ke`)
28. **Co-operative University of Kenya (CUK)** — Nairobi (`cuk.ac.ke`)
29. **Kaimosi Friends University (KAFU)** — Vihiga (`kafu.ac.ke`)
30. **Alupe University** — Busia (`alupe.ac.ke`)
31. **Tharaka University** — Tharaka Nithi (`tharaka.ac.ke`)

### B. Public Constituent Colleges & Technical Universities (4)
32. **Turkana University College** — Turkana (`tuc.ac.ke`)
33. **Bomet University College** — Bomet (`buc.ac.ke`)
34. **Tom Mboya University** — Homa Bay (`tmu.ac.ke`)
35. **Kenya Medical Training College (KMTC)** — Nationwide HQ Nairobi (`kmtc.ac.ke`)

### C. Private Chartered Universities (21)
36. **Strathmore University** — Nairobi (`strathmore.edu`)
37. **Mount Kenya University (MKU)** — Kiambu (`mku.ac.ke`)
38. **KCA University** — Nairobi (`kca.ac.ke`)
39. **Kabarak University** — Nakuru (`kabarak.ac.ke`)
40. **Daystar University** — Machakos / Nairobi (`daystar.ac.ke`)
41. **United States International University - Africa (USIU-A)** — Nairobi (`usiu.ac.ke`)
42. **Catholic University of Eastern Africa (CUEA)** — Nairobi (`cuea.edu`)
43. **St. Paul's University** — Kiambu (`spu.ac.ke`)
44. **Pan Africa Christian (PAC) University** — Nairobi (`pacuniversity.ac.ke`)
45. **Kenya Methodist University (KeMU)** — Meru / Nairobi (`kemu.ac.ke`)
46. **Africa Nazarene University (ANU)** — Kajiado (`anu.ac.ke`)
47. **Great Lakes University of Kisumu (GLUK)** — Kisumu (`gluk.ac.ke`)
48. **Scott Christian University** — Machakos (`scott.ac.ke`)
49. **Adventist University of Africa (AUA)** — Kajiado (`aua.ac.ke`)
50. **Management University of Africa (MUA)** — Nairobi (`mua.ac.ke`)
51. **Riara University** — Nairobi (`riara.ac.ke`)
52. **Pioneer International University** — Nairobi (`piu.ac.ke`)
53. **Zetech University** — Kiambu (`zetech.ac.ke`)
54. **Lukenya University** — Makueni (`lukenyauniversity.ac.ke`)
55. **RAF International University** — Kajiado (`riu.ac.ke`)
56. **Umma University** — Kajiado (`umma.ac.ke`)

### D. Private Universities Under Interim Authority & Colleges (14)
57. **Tangaza University** — Nairobi (`tangaza.ac.ke`)
58. **KAG East University** — Kajiado (`east.ac.ke`)
59. **International Leadership University (ILU)** — Nairobi (`ilu.ac.ke`)
60. **Kiriri Women's University of Science & Technology** — Nairobi (`kwust.ac.ke`)
61. **Presbyterian University of East Africa (PUEA)** — Kiambu (`puea.ac.ke`)
62. **Gretsa University** — Kiambu (`gretsauniversity.ac.ke`)
63. **Kenya Highlands University** — Kericho (`khu.ac.ke`)
64. **Africa International University (AIU)** — Nairobi (`aiu.ac.ke`)
65. **Amref International University (AMIU)** — Nairobi (`amiu.ac.ke`)
66. **Aga Khan University (Kenya)** — Nairobi (`aku.edu`)
67. **Uzima University** — Kisumu (`uzimauniversity.ac.ke`)
68. **Marist International University College** — Nairobi (`miuc.ac.ke`)
69. **Hekima University College** — Nairobi (`hekima.ac.ke`)
70. **Islamic University of Kenya** — Kajiado (`iuk.ac.ke`)


---

## 🔒 5. Disclaimer & Compliance Rules

* **Independence Directive:** Must state clearly: *"Chuo Connect Kenya is an independent platform and is not affiliated with, endorsed by, or integrated with KUCCPS or CUE."*
* **Indicative Cut-Offs:** All cut-off points are explicitly labeled as *"Indicative estimates based on the 2024 KUCCPS placement cycle — for guidance only."*
* **Official Application Gateway:** Directs all final student applications to the official portal: `https://students.kuccps.ac.ke`.
