-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. UNIVERSITIES TABLE
-- ==========================================
create table public.universities (
  id text primary key,
  name text not null,
  abbrev text not null,
  type text check (type in ('Public', 'Private')) not null,
  location text not null,
  founded integer not null,
  students integer not null,
  description text not null,
  "logoUrl" text,
  "coverUrl" text,
  gallery jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed Universities
insert into public.universities (id, name, abbrev, type, location, founded, students, description) values
('uon', 'University of Nairobi', 'UON', 'Public', 'Nairobi', 1970, 80000, 'Kenya''s premier institution of higher learning, known for rigorous academic programs and producing top-tier industry leaders across East Africa.'),
('jkuat', 'Jomo Kenyatta University of Agriculture and Technology', 'JKUAT', 'Public', 'Juja', 1994, 45000, 'Leading university in agriculture, engineering, and technology innovation.'),
('strath', 'Strathmore University', 'STRATH', 'Private', 'Nairobi', 1961, 15000, 'Top private university renowned for business, IT, and accounting excellence.'),
('ku', 'Kenyatta University', 'KU', 'Public', 'Nairobi', 1985, 70000, 'Leading in education, humanities, and health sciences with a massive modern campus.'),
('mku', 'Mount Kenya University', 'MKU', 'Private', 'Thika', 2008, 50000, 'Fastest growing private university with a strong focus on health sciences and practical skills.'),
('mu', 'Moi University', 'MU', 'Public', 'Eldoret', 1984, 40000, 'Pioneering university in western Kenya known for medicine, engineering, and information sciences.'),
('usiu', 'United States International University Africa', 'USIU', 'Private', 'Nairobi', 1989, 10000, 'Premier international university offering dual accreditation (Kenya and USA).'),
('pac', 'Pan Africa Christian University', 'PAC', 'Private', 'Nairobi', 1978, 5000, 'Chartered private university focusing on leadership, theology, and business.');

-- ==========================================
-- 2. COURSES TABLE
-- ==========================================
create table public.courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  "clusterGroup" text not null,
  "minPoints" numeric not null,
  description text not null,
  duration text not null,
  "universityIds" text[] not null, -- Array of university IDs that offer this course
  "careerOutcomes" text[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed Courses
insert into public.courses (title, "clusterGroup", "minPoints", description, duration, "universityIds", "careerOutcomes") values
('Bachelor of Medicine and Bachelor of Surgery (MBChB)', 'Medicine & Health:Cluster 13', 45.0, 'Intensive program producing qualified medical doctors and surgeons.', '6 Years', '{uon,ku,jkuat,mku,mu}', '{Medical Doctor,Surgeon,Public Health Specialist}'),
('Bachelor of Science in Computer Science', 'Computing & IT:Cluster 9', 40.5, 'Comprehensive study of computing theory, algorithms, software engineering, and artificial intelligence.', '4 Years', '{uon,jkuat,strath,ku,mku,usiu}', '{Software Engineer,Systems Analyst,AI Researcher}'),
('Bachelor of Commerce (BCom)', 'Business & Economics:Cluster 4', 32.0, 'Core business principles including accounting, finance, marketing, and management.', '4 Years', '{uon,jkuat,strath,ku,mku,mu,usiu,pac}', '{Accountant,Financial Analyst,Marketing Manager}'),
('Bachelor of Laws (LLB)', 'Law & Legal Studies:Cluster 1', 42.0, 'Rigorous legal training preparing students for the bar and legal practice.', '4 Years', '{uon,strath,ku,mku}', '{Advocate,Legal Advisor,Magistrate}'),
('Bachelor of Science in Civil Engineering', 'Engineering & Technology:Cluster 7', 41.5, 'Design, construction, and maintenance of the physical and naturally built environment.', '5 Years', '{uon,jkuat,ku,mu}', '{Civil Engineer,Structural Engineer,Project Manager}'),
('Bachelor of Science in Nursing', 'Medicine & Health:Cluster 13', 38.0, 'Advanced nursing practice, patient care, and healthcare administration.', '4 Years', '{uon,jkuat,ku,mku}', '{Registered Nurse,Clinical Officer,Healthcare Administrator}'),
('Bachelor of Arts in Communication', 'Arts & Humanities:Cluster 3', 30.0, 'Media studies, journalism, public relations, and corporate communication.', '4 Years', '{uon,strath,ku,usiu,pac}', '{Journalist,PR Specialist,Corporate Communicator}');

-- ==========================================
-- 3. PROFILES TABLE (For users)
-- ==========================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('student', 'university_partner', 'admin')) default 'student' not null,
  "fullName" text,
  "universityId" text references public.universities(id), -- For partners to link to a uni
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.universities enable row level security;
alter table public.courses enable row level security;
alter table public.profiles enable row level security;

-- Public read access for universities and courses
create policy "Allow public read access on universities" on public.universities for select using (true);
create policy "Allow public read access on courses" on public.courses for select using (true);

-- Profile policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, "fullName", role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'student');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create a profile when a user signs up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
