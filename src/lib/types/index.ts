// ============================================
// TypeScript types for the entire application
// ============================================

export type UniversityType = 'Public' | 'Private' | 'Technical' | 'TVET';

export interface University {
  id: string;
  name: string;
  abbrev: string;
  type: UniversityType;
  county: string;
  established: number;
  ranking: number;
  students: string;
  fees: string;
  accommodation: string;
  facilities: string[];
  image: string;
  overview: string;
  history?: string;
  virtualTourUrl?: string;
  rating?: number;
  reviewCount?: number;
  programs?: string[];
  entryRequirements?: string;
  sportsInfo?: string;
  libraryInfo?: string;
  labsInfo?: string;
  innovationHub?: string;
  clubsAndSocieties?: string[];
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  campusSize?: string;
  location?: {
    lat: number;
    lng: number;
  };
  gallery?: GalleryItem[];
}

export interface GalleryItem {
  id: string;
  universityId: string;
  type: 'photo' | 'video' | 'virtual_tour' | 'drone';
  url: string;
  caption?: string;
  thumbnailUrl?: string;
}

export type ClusterGroup =
  | 'Cluster 1: Pure Sciences'
  | 'Cluster 2: Biological Sciences'
  | 'Cluster 3: Technical & Applied Sciences'
  | 'Cluster 4: Social Sciences & Humanities';

export interface Course {
  id: string;
  title: string;
  clusterGroup: ClusterGroup;
  minPoints: number;
  duration: string;
  description: string;
  universityIds: string[];
  careerOutcomes?: string[];
}

export interface Review {
  id: string;
  universityId: string;
  userId: string;
  authorName: string;
  type: 'student' | 'consumer';
  overallRating: number;
  body: string;
  criteriaScores?: {
    academic?: number;
    environment?: number;
    accommodation?: number;
    facilities?: number;
    safety?: number;
    support?: number;
    studentLife?: number;
  };
  helpful?: number;
  verified?: boolean;
  createdAt: string;
}

export interface Ambassador {
  id: string;
  universityId: string;
  userId: string;
  name: string;
  course: string;
  year: string;
  bio: string;
  avatar?: string;
  topics: string[];
  responseTime?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  ambassadorId: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  universityId?: string;
  amount: string;
  deadline: string;
  eligibility: string;
  description: string;
  applicationUrl?: string;
  category: 'government' | 'private' | 'institutional' | 'international';
}

export interface Housing {
  id: string;
  name: string;
  universityId?: string;
  type: 'hostel' | 'apartment' | 'bedsitter' | 'shared';
  location: string;
  county: string;
  price: string;
  amenities: string[];
  contactPhone?: string;
  contactEmail?: string;
  image?: string;
  available: boolean;
}

export interface Event {
  id: string;
  universityId?: string;
  universityName?: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  category: 'academic' | 'sports' | 'cultural' | 'career' | 'social' | 'admission';
  image?: string;
  registrationUrl?: string;
  isFeatured?: boolean;
}

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  kcseGrade: string;
  clusterPoints?: number;
  county?: string;
  budget?: string;
  interests?: string[];
  careerGoals?: string;
  favouriteUniversities: string[];
  favouriteCourses: string[];
  compareList?: string[];
  createdAt: string;
}

export interface UniversityPartner {
  id: string;
  universityId: string;
  userId: string;
  role: 'admin' | 'editor';
}

export interface Lead {
  studentName: string;
  matchScore: number;
  clusterPoints: number;
  targetCourse: string;
  status: 'Favorited' | 'Viewed Profile' | 'Applied';
}

export interface PortalMetrics {
  profileViews: number;
  profileViewsChange: number;
  prospectiveLeads: number;
  leadsChange: number;
  avgRecommendation: number;
  recommendationChange: number;
}

export interface SearchFilters {
  query?: string;
  type?: string;
  county?: string;
  maxFees?: number;
  facilities?: string[];
  accommodation?: boolean;
  minRating?: number;
}
