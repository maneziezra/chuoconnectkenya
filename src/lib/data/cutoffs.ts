export interface Course {
  abbr: string;
  name: string;
  uni: string;
  cutoff: number;
  link: string;
  uniId: string;
}

export const MATCHING_COURSES: Course[] = [
  { abbr: 'UN', name: 'MBChB (Bachelor of Medicine & Surgery)', uni: 'University of Nairobi', cutoff: 44.9, link: 'https://uonbi.ac.ke', uniId: 'uon' },
  { abbr: 'MU', name: 'MBChB (Medicine & Surgery)', uni: 'Moi University', cutoff: 44.5, link: 'https://mu.ac.ke', uniId: 'moi' },
  { abbr: 'KU', name: 'MBChB (Medicine & Surgery)', uni: 'Kenyatta University', cutoff: 44.2, link: 'https://ku.ac.ke', uniId: 'ku' },
  { abbr: 'MU', name: 'Bachelor of Medicine & Surgery', uni: 'Maseno University', cutoff: 43.8, link: 'https://maseno.ac.ke', uniId: 'moi' }, // Note: Maseno is not in seed, fallback to moi or external
  { abbr: 'UN', name: 'Bachelor of Dental Surgery (BDS)', uni: 'University of Nairobi', cutoff: 43.0, link: 'https://uonbi.ac.ke', uniId: 'uon' },
  { abbr: 'UN', name: 'Bachelor of Pharmacy (BPharm)', uni: 'University of Nairobi', cutoff: 42.5, link: 'https://uonbi.ac.ke', uniId: 'uon' },
  { abbr: 'UN', name: 'Bachelor of Laws (LLB)', uni: 'University of Nairobi', cutoff: 42.0, link: 'https://uonbi.ac.ke', uniId: 'uon' },
  { abbr: 'SU', name: 'Bachelor of Laws (LLB)', uni: 'Strathmore University', cutoff: 41.0, link: 'https://strathmore.edu', uniId: 'strath' },
  { abbr: 'UN', name: 'Bachelor of Science in Nursing', uni: 'University of Nairobi', cutoff: 40.5, link: 'https://uonbi.ac.ke', uniId: 'uon' },
  { abbr: 'MU', name: 'Bachelor of Laws (LLB)', uni: 'Moi University', cutoff: 40.0, link: 'https://mu.ac.ke', uniId: 'moi' },
  { abbr: 'CUE', name: 'Bachelor of Laws (LLB)', uni: 'Catholic University of Eastern Africa', cutoff: 39.2, link: 'https://cuea.edu', uniId: 'strath' }, // Fallback to strath for missing seed
  { abbr: 'USI', name: 'BSc. Computer Science', uni: 'United States International University', cutoff: 39.0, link: 'https://usiu.ac.ke', uniId: 'usiu' },
  { abbr: 'KU', name: 'Bachelor of Science in Nursing', uni: 'Kenyatta University', cutoff: 38.5, link: 'https://ku.ac.ke', uniId: 'ku' },
  { abbr: 'UN', name: 'Bachelor of Engineering in Civil Engineering', uni: 'University of Nairobi', cutoff: 38.5, link: 'https://uonbi.ac.ke', uniId: 'uon' },
  { abbr: 'USI', name: 'BSc. International Business Administration', uni: 'United States International University', cutoff: 38.5, link: 'https://usiu.ac.ke', uniId: 'usiu' },
  { abbr: 'USI', name: 'BSc. Actuarial Science', uni: 'United States International University', cutoff: 38.5, link: 'https://usiu.ac.ke', uniId: 'usiu' },
  { abbr: 'KMU', name: 'BSc. Nursing', uni: 'Kenya Methodist University', cutoff: 38.0, link: 'https://kemu.ac.ke', uniId: 'ku' }, // Fallback
  { abbr: 'MU', name: 'Bachelor of Science in Nursing', uni: 'Moi University', cutoff: 37.5, link: 'https://mu.ac.ke', uniId: 'moi' },
  { abbr: 'UN', name: 'Bachelor of Engineering in Electrical Engineering', uni: 'University of Nairobi', cutoff: 37.5, link: 'https://uonbi.ac.ke', uniId: 'uon' },
  { abbr: 'AKU', name: 'BSc. Nursing (Direct Entry)', uni: 'Aga Khan University', cutoff: 37.5, link: 'https://aku.edu', uniId: 'uon' }, // Fallback
];
