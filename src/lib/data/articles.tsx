import React from 'react';
import { BookOpen, Lightbulb, Award, TrendingUp } from 'lucide-react';

export interface Article {
  slug: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  readTime: string;
  content: React.ReactNode;
}

export const ARTICLES: Article[] = [
  {
    slug: 'how-to-choose-the-right-course',
    icon: <BookOpen size={24} />,
    title: 'How to Choose the Right Course',
    desc: 'Don\'t just follow the crowd. Learn how to align your interests, strengths, and market demand to select a course that guarantees a fulfilling career.',
    readTime: '5 min read',
    content: (
      <>
        <h2>Introduction</h2>
        <p>Choosing a university course is one of the most critical decisions a student will make. Many students select courses based on peer pressure, parental expectations, or perceived prestige, only to find themselves unsatisfied or unemployable upon graduation.</p>
        
        <h2>1. Assess Your Interests and Strengths</h2>
        <p>Before looking at external factors, look inward. What subjects do you naturally excel at? What activities do you enjoy doing in your free time? A career built on your natural strengths will not only be more fulfilling but will also set you up for long-term success.</p>
        
        <h2>2. Analyze Market Demand</h2>
        <p>Passion is important, but employability matters. Research the fastest-growing industries in Kenya and East Africa. Fields like Information Technology, Renewable Energy, Agribusiness, and Healthcare are seeing massive growth. Balance what you love with what the world needs.</p>
        
        <h2>3. Consider Your Long-Term Goals</h2>
        <p>Where do you see yourself in 10 years? Do you want to be an entrepreneur, work in a corporate environment, or impact communities through an NGO? Select a course that acts as a stepping stone toward that vision.</p>
        
        <h2>4. Talk to Industry Professionals</h2>
        <p>Don't rely solely on university brochures. Reach out to professionals working in the fields you are interested in. Ask them about their daily routines, the challenges they face, and whether they would recommend their career path to a young graduate.</p>
        
        <h2>Conclusion</h2>
        <p>Your degree is an investment of time, money, and energy. Take the time to make an informed decision. Remember, no choice is entirely permanent—skills are transferable, but a strong, deliberate start makes the journey much smoother.</p>
      </>
    )
  },
  {
    slug: 'understanding-kuccps-cluster-points',
    icon: <Lightbulb size={24} />,
    title: 'Understanding KUCCPS Cluster Points',
    desc: 'A complete breakdown of how the official KUCCPS formula works, what raw scores mean, and how to strategically apply for programmes.',
    readTime: '8 min read',
    content: (
      <>
        <h2>What are Cluster Points?</h2>
        <p>The Kenya Universities and Colleges Central Placement Service (KUCCPS) uses a mathematical formula to determine a student's eligibility for specific university programs. This score is known as the "cluster weight" or "cluster points."</p>
        
        <h2>The Formula Explained</h2>
        <p>Your cluster weight is calculated based on four subjects that are strictly relevant to the degree program you are applying for, compared against the maximum possible score (which represents an 'A' in all four subjects). The exact formula involves the aggregate points of these four subjects and your overall KCSE aggregate grade.</p>
        
        <h2>Why Do Cut-Off Points Fluctuate?</h2>
        <p>Cut-off points are not fixed. They fluctuate every year based on the overall performance of students nationwide and the specific capacity of universities. If many highly qualified students apply for Medicine at the University of Nairobi, the cut-off point for that year will rise.</p>
        
        <h2>Strategic Application Tips</h2>
        <ul>
          <li><strong>Be Realistic:</strong> Don't fill all your choices with highly competitive courses (like Medicine, Engineering, or Law) if your cluster points are marginally close to the previous year's cut-off.</li>
          <li><strong>Diversify Your Choices:</strong> Mix your top choices with slightly less competitive but equally rewarding programs as your subsequent choices.</li>
          <li><strong>Understand the Subject Requirements:</strong> Ensure you meet the minimum subject requirements. High cluster points will not save you if you scored a 'C' in Mathematics for a course that strictly requires a 'B'.</li>
        </ul>
      </>
    )
  },
  {
    slug: 'top-scholarships-for-kenyan-students',
    icon: <Award size={24} />,
    title: 'Top Scholarships for Kenyan Students',
    desc: 'A curated list of government, private, and international scholarships available for undergraduate studies, including eligibility requirements.',
    readTime: '10 min read',
    content: (
      <>
        <h2>The Cost of Higher Education</h2>
        <p>University education is a significant financial investment. However, numerous organizations are dedicated to ensuring that bright, needy students are not locked out of higher education.</p>
        
        <h2>1. Higher Education Loans Board (HELB)</h2>
        <p>The primary source of funding for Kenyan university students. HELB provides loans, bursaries, and scholarships. All KUCCPS-placed students in public and private universities are eligible to apply. Ensure you apply early when the portal opens to avoid missing out on the first allocation.</p>
        
        <h2>2. Equity Bank Wings to Fly & ELP</h2>
        <p>While Wings to Fly primarily targets high school students, top-performing beneficiaries are transitioned into the Equity Leaders Program (ELP), which offers paid internships and helps students secure full scholarships to global universities like Harvard, MIT, and Stanford.</p>
        
        <h2>3. The MasterCard Foundation Scholars Program</h2>
        <p>This program partners with institutions like the University of Nairobi and United States International University-Africa (USIU-Africa) to offer comprehensive scholarships covering tuition, accommodation, books, and a stipend. They specifically look for transformative leaders from disadvantaged backgrounds.</p>
        
        <h2>4. Rattansi Educational Trust</h2>
        <p>The Rattansi Trust provides bursaries to needy students enrolled in public and private universities in Kenya. Applications are typically routed through the university's financial aid office or Dean of Students.</p>
        
        <h2>How to Prepare a Winning Application</h2>
        <ul>
          <li>Start gathering documents early (death certificates of parents, letters from chiefs, high school leaving certificates).</li>
          <li>Write compelling personal statements that focus on your resilience and vision to give back to the community.</li>
          <li>Maintain excellent academic records, as most scholarships have a minimum grade threshold.</li>
        </ul>
      </>
    )
  },
  {
    slug: 'most-in-demand-careers-in-kenya',
    icon: <TrendingUp size={24} />,
    title: 'Most In-Demand Careers in Kenya (2026)',
    desc: 'Data-driven insights into the fastest-growing industries in East Africa, from AI and software engineering to renewable energy and agribusiness.',
    readTime: '6 min read',
    content: (
      <>
        <h2>The Shifting Job Market</h2>
        <p>The traditional pillars of employment in Kenya (such as banking, teaching, and standard administrative roles) are evolving rapidly. Driven by digital transformation, climate change, and population growth, the job market of 2026 looks vastly different from a decade ago.</p>
        
        <h2>1. Software Engineering & AI Development</h2>
        <p>As the "Silicon Savannah" continues to grow, there is an insatiable demand for developers, data scientists, and cybersecurity experts. Financial institutions, telecommunications (like Safaricom), and hundreds of tech startups are constantly hunting for local tech talent.</p>
        
        <h2>2. Renewable Energy & Sustainability</h2>
        <p>Kenya is a global leader in geothermal energy. Careers in green energy, environmental science, and sustainable urban planning are expanding as the world pushes towards net-zero emissions. Solar engineers and environmental impact consultants are highly sought after.</p>
        
        <h2>3. Advanced Agribusiness</h2>
        <p>Agriculture remains the backbone of the Kenyan economy, but it is moving from traditional farming to agritech. Careers in agricultural biotechnology, supply chain logistics, and precision farming (using drones and sensors) are modernizing the sector and creating high-paying jobs.</p>
        
        <h2>4. Healthcare & Biotechnology</h2>
        <p>The demand for healthcare professionals extends beyond traditional doctors and nurses. Biomedical engineers, public health data analysts, and health informatics specialists are crucial as the country works to improve its healthcare infrastructure and response to global health crises.</p>
        
        <h2>Conclusion</h2>
        <p>When selecting a course, look at where the world is going, not where it has been. Equipping yourself with digital skills, regardless of your primary field of study, will give you a significant competitive advantage in the future job market.</p>
      </>
    )
  }
];
