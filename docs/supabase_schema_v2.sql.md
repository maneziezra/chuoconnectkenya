-- Drop existing tables to recreate with full schema
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop table if exists public.profiles cascade;
drop table if exists public.courses cascade;
drop table if exists public.universities cascade;

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. UNIVERSITIES TABLE
-- ==========================================
create table public.universities (
  id text primary key,
  name text not null,
  abbrev text not null,
  type text check (type in ('Public', 'Private', 'Technical')) not null,
  county text not null,
  established integer not null,
  ranking integer,
  students text not null,
  fees text not null,
  accommodation text not null,
  facilities text[] not null default '{}',
  image text not null,
  overview text not null,
  history text,
  "virtualTourUrl" text,
  rating numeric,
  "reviewCount" integer,
  programs text[] default '{}',
  "entryRequirements" text,
  "sportsInfo" text,
  "libraryInfo" text,
  "labsInfo" text,
  "innovationHub" text,
  "clubsAndSocieties" text[] default '{}',
  "contactEmail" text,
  "contactPhone" text,
  website text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed Universities
insert into public.universities (id, name, abbrev, type, county, established, ranking, students, fees, image, overview, accommodation, facilities, programs, "entryRequirements", "sportsInfo", "libraryInfo", "labsInfo", "innovationHub", "contactEmail", "contactPhone", website, rating, "reviewCount") values
('uon', 'University of Nairobi', 'UoN', 'Public', 'Nairobi', 1970, 1, '80,000+', 'Ksh 150k – 500k / year', 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=800&q=80', 'The University of Nairobi is Kenya''s oldest and largest public university, consistently ranked among the top universities in East Africa. It offers a comprehensive range of academic programmes across health sciences, engineering, law, and technology.', 'Multiple on-campus hostels with shared and single-occupancy rooms. Priority given to first-year students. Off-campus options available in Ngara, Westlands, and Upper Hill.', '{"Libraries", "Labs", "Sports", "Hostels", "Healthcare", "Innovation Hub"}', '{"Computer Science", "Software Engineering", "Data Science", "Medicine", "Law", "Engineering"}', 'Minimum KCSE Mean Grade of B+ (62 points). Specific cluster points vary by programme.', 'State-of-the-art sports complex with an Olympic-size pool, football pitches, basketball courts, and athletics tracks.', 'The Jomo Kenyatta Memorial Library holds over 400,000 volumes and provides 24/7 digital access.', 'Modern computer labs, advanced chemistry and biology labs, and dedicated AI research facilities.', 'UoN Innovation Hub supports student-led startups with mentorship, funding access, and co-working spaces.', 'info@uonbi.ac.ke', '+254 020 318 262', 'https://www.uonbi.ac.ke', 4.6, 1248),
('jkuat', 'Jomo Kenyatta University of Agriculture and Technology', 'JKUAT', 'Public', 'Kiambu', 1994, 2, '50,000+', 'Ksh 120k – 450k / year', 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80', 'JKUAT is a leading science and technology university in Kenya, renowned for its engineering, computing, and agricultural sciences programmes.', 'Extensive on-campus halls with modern facilities including wifi, study rooms, and 24-hour security.', '{"Libraries", "Labs", "Sports", "Hostels", "Innovation Hub", "Robotics Lab"}', '{"Computer Science", "Electrical Engineering", "Mechatronics", "Agricultural Engineering", "BSc IT"}', 'Minimum KCSE Mean Grade of B (50 points) for most programmes.', null, null, null, null, 'info@jkuat.ac.ke', null, 'https://www.jkuat.ac.ke', 4.5, 987),
('strath', 'Strathmore University', 'STRATH', 'Private', 'Nairobi', 2002, 3, '7,000+', 'Ksh 300k – 900k / year', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80', 'Strathmore University is Kenya''s leading private university for business, law, and information technology. Known for excellent graduate employability and strong corporate partnerships.', 'Limited on-campus accommodation; strong partnerships with accredited off-campus residences nearby.', '{"Libraries", "Labs", "Sports", "Innovation Hub", "Business Incubator"}', '{"BSc Applied Computer Science", "Business Information Technology", "BSc Computer Science", "Commerce", "Law"}', 'Minimum KCSE Mean Grade of B (50 points). Aptitude test required for Computer Science.', null, null, null, null, 'admissions@strathmore.edu', null, 'https://strathmore.edu', 4.7, 643),
('ku', 'Kenyatta University', 'KU', 'Public', 'Nairobi', 1985, 4, '60,000+', 'Ksh 100k – 350k / year', 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80', 'Kenyatta University is one of Kenya''s largest public universities, highly regarded for education, arts, science, and technology programmes.', 'Large on-campus hostels. Well-maintained facilities with study rooms and cafeterias.', '{"Libraries", "Labs", "Sports", "Hostels", "Healthcare"}', '{"Computer Science", "Education Technology", "Actuarial Science", "Nursing", "Public Health"}', 'Minimum KCSE Mean Grade of B- (46 points).', null, null, null, null, 'info@ku.ac.ke', null, 'https://www.ku.ac.ke', 4.3, 1102),
('mku', 'Mount Kenya University', 'MKU', 'Private', 'Kirinyaga', 2008, 5, '30,000+', 'Ksh 100k – 350k / year', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80', 'Mount Kenya University is a fast-growing private university offering programmes across health sciences, education, business and IT.', 'Modern hostels at the Thika main campus with a variety of room types.', '{"Libraries", "Labs", "Hostels", "Sports"}', '{"Computer Science", "Information Technology", "Health Informatics", "Business IT"}', 'Minimum KCSE Mean Grade of C+ (35 points).', null, null, null, null, null, null, 'https://www.mku.ac.ke', 4.1, 520),
('moi', 'Moi University', 'MU', 'Public', 'Uasin Gishu', 1984, 6, '35,000+', 'Ksh 100k – 300k / year', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', 'Moi University is a public research university based in Eldoret, one of the most extensive universities in Kenya with a large campus and diverse academic offerings.', 'Extensive on-campus student residences. Notable affordable pricing for students.', '{"Libraries", "Labs", "Hostels", "Sports", "Healthcare"}', '{"Information Science", "Computer Technology", "Engineering", "Medicine", "Education"}', 'Minimum KCSE Mean Grade of B- (46 points).', null, null, null, null, null, null, 'https://www.mu.ac.ke', 4.2, 880),
('usiu', 'United States International University - Africa', 'USIU', 'Private', 'Nairobi', 1969, 7, '6,000+', 'Ksh 400k – 1.2M / year', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', 'USIU-Africa is an internationally accredited university offering American-style education with a strong focus on business, psychology, and information technology.', 'Secure, modern on-campus residence halls.', '{"Libraries", "Labs", "Sports", "Hostels", "Innovation Lab"}', '{"BSc Computer Science", "Business Administration", "Entrepreneurship", "Digital Transformation"}', 'Minimum KCSE Mean Grade of B (50 points). SAT or equivalent accepted.', null, null, null, null, null, null, 'https://www.usiu.ac.ke', 4.5, 390),
('pu', 'Pan Africa Christian University', 'PAC', 'Private', 'Nairobi', 1978, 8, '3,000+', 'Ksh 180k – 450k / year', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80', 'Pan Africa Christian University offers quality undergraduate and postgraduate programmes in a values-based environment.', 'Campus hostels available for both male and female students.', '{"Libraries", "Labs", "Sports", "Hostels"}', '{"Information Technology", "Communications", "Business", "Theology"}', 'Minimum KCSE Mean Grade of C+ (35 points).', null, null, null, null, null, null, 'https://www.pacuniversity.ac.ke', 4.0, 215);

-- ==========================================
-- 2. COURSES TABLE
-- ==========================================
create table public.courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  "clusterGroup" text not null,
  "minPoints" numeric not null,
  duration text not null,
  description text not null,
  "universityIds" text[] not null,
  "careerOutcomes" text[] not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed Courses
insert into public.courses (title, "clusterGroup", "minPoints", duration, description, "universityIds", "careerOutcomes") values
('Bachelor of Medicine and Bachelor of Surgery (MBChB)', 'Cluster 13: Medicine, Nursing & Health', 44.5, '6 Years', 'The MBChB is a highly competitive and rigorous programme designed to produce competent medical practitioners.', '{"uon", "ku", "jkuat", "mku", "moi"}', '{"Medical Doctor", "Surgeon", "Public Health Officer", "Medical Researcher"}'),
('Bachelor of Science in Computer Science', 'Cluster 9: Computing & Information Technology', 39.8, '4 Years', 'A comprehensive study of algorithms, software engineering, artificial intelligence, and computing systems.', '{"uon", "jkuat", "strath", "ku", "mku", "usiu"}', '{"Software Engineer", "Systems Analyst", "Data Scientist", "Cybersecurity Expert"}'),
('Bachelor of Laws (LLB)', 'Cluster 1: Law & Legal Studies', 42.1, '4 Years', 'The LLB programme provides a solid foundation in the principles of law, legal systems, and jurisprudence.', '{"uon", "strath", "ku", "mku"}', '{"Advocate", "Corporate Lawyer", "Legal Advisor", "Magistrate"}'),
('Bachelor of Commerce (BCom)', 'Cluster 4: Business & Economics', 31.5, '4 Years', 'A versatile business degree offering specializations in Accounting, Finance, Marketing, and Human Resources.', '{"uon", "strath", "ku", "jkuat", "mku", "moi", "usiu", "pu"}', '{"Accountant", "Financial Analyst", "Marketing Manager", "Business Consultant"}'),
('Bachelor of Science in Civil Engineering', 'Cluster 7: Engineering & Technology', 41.2, '5 Years', 'Focuses on the design, construction, and maintenance of the physical and naturally built environment.', '{"uon", "jkuat", "ku", "moi"}', '{"Civil Engineer", "Structural Engineer", "Project Manager", "Construction Manager"}'),
('Bachelor of Arts in Communication', 'Cluster 3: Arts & Humanities', 28.5, '4 Years', 'Explores mass media, public relations, journalism, and corporate communication strategies.', '{"uon", "strath", "ku", "usiu", "pu"}', '{"Journalist", "Public Relations Specialist", "Corporate Communications Manager"}'),
('Bachelor of Science in Nursing (BScN)', 'Cluster 13: Medicine, Nursing & Health', 37.9, '4 Years', 'Prepares students for professional nursing practice, healthcare administration, and clinical research.', '{"uon", "ku", "jkuat", "mku"}', '{"Registered Nurse", "Clinical Officer", "Healthcare Administrator"}'),
('Bachelor of Economics and Statistics', 'Cluster 4: Business & Economics', 35.2, '4 Years', 'Combines economic theory with advanced statistical methods for data-driven decision making.', '{"uon", "ku", "jkuat", "moi"}', '{"Economist", "Data Analyst", "Actuary", "Policy Analyst"}');

-- ==========================================
-- 3. PROFILES TABLE (For users)
-- ==========================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('student', 'university_partner', 'admin')) default 'student' not null,
  "fullName" text,
  "universityId" text references public.universities(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.universities enable row level security;
alter table public.courses enable row level security;
alter table public.profiles enable row level security;

create policy "Allow public read access on universities" on public.universities for select using (true);
create policy "Allow public read access on courses" on public.courses for select using (true);
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, "fullName", role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'student');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
