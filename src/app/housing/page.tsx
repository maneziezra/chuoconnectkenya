import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone, Mail, Home, Search, XCircle, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import type { Housing } from '@/lib/types';

const MOCK_HOUSING: Housing[] = [
  {
    "id": "h1",
    "name": "Qwetu Hurlingham",
    "universityId": "strath",
    "type": "hostel",
    "location": "Hurlingham",
    "county": "Nairobi",
    "price": "KES 26,000 / month",
    "amenities": [
      "High-speed Wi-Fi",
      "Gym",
      "Backup Generator",
      "Shuttle Service",
      "24/7 Security"
    ],
    "contactPhone": "0800 733 333",
    "available": true,
    "image": "/images/housing/diverse-housing-1.jpg"
  },
  {
    "id": "h2",
    "name": "Qwetu Jogoo Road",
    "universityId": "uon",
    "type": "hostel",
    "location": "Jogoo Road",
    "county": "Nairobi",
    "price": "KES 24,000 / month",
    "amenities": [
      "Wi-Fi",
      "Gym",
      "Biometric Access",
      "Study Rooms"
    ],
    "contactPhone": "0800 733 333",
    "available": true,
    "image": "/images/housing/diverse-housing-2.jpg"
  },
  {
    "id": "h3",
    "name": "Qejani Catholic University",
    "universityId": "cuea",
    "type": "hostel",
    "location": "Karen",
    "county": "Nairobi",
    "price": "KES 14,500 / month",
    "amenities": [
      "24/7 Security",
      "Wi-Fi",
      "Constant Water",
      "Study Lounges"
    ],
    "contactPhone": "0800 733 333",
    "available": true,
    "image": "/images/housing/diverse-housing-3.jpg"
  },
  {
    "id": "h4",
    "name": "Qwetu Ruaraka",
    "universityId": "kca",
    "type": "apartment",
    "location": "Thika Road",
    "county": "Nairobi",
    "price": "KES 22,000 / month",
    "amenities": [
      "Spacious Rooms",
      "Balcony",
      "Secure Compound",
      "Borehole Water"
    ],
    "contactPhone": "0800 733 333",
    "available": true,
    "image": "/images/housing/diverse-housing-4.jpg"
  },
  {
    "id": "h5",
    "name": "Qwetu Aberdare Heights",
    "universityId": "usiu",
    "type": "hostel",
    "location": "Roysambu",
    "county": "Nairobi",
    "price": "KES 25,500 / month",
    "amenities": [
      "Wi-Fi",
      "Gym",
      "Recreation Room",
      "Backup Generator",
      "Shuttle Service"
    ],
    "contactPhone": "0800 733 333",
    "available": true,
    "image": "/images/housing/diverse-housing-5.jpg"
  },
  {
    "id": "h6",
    "name": "City Baringo Hostel",
    "universityId": "uni_baringo",
    "type": "hostel",
    "location": "Baringo CBD",
    "county": "Baringo",
    "price": "KES 5,500 / month",
    "amenities": [
      "En-suite bathrooms",
      "High-speed Wi-Fi",
      "CCTV",
      "Ample Parking"
    ],
    "contactPhone": "+254 700 514675",
    "available": true,
    "image": "/images/housing/diverse-housing-5.jpg"
  },
  {
    "id": "h7",
    "name": "Central Baringo Suites",
    "universityId": "uni_baringo",
    "type": "apartment",
    "location": "Baringo CBD",
    "county": "Baringo",
    "price": "KES 11,500 / month",
    "amenities": [
      "En-suite bathrooms",
      "High-speed Wi-Fi",
      "CCTV",
      "Ample Parking"
    ],
    "contactPhone": "+254 700 129872",
    "available": true,
    "image": "/images/housing/diverse-housing-27.jpg"
  },
  {
    "id": "h8",
    "name": "Pwani Bomet Villas",
    "universityId": "uni_bomet",
    "type": "hostel",
    "location": "Bomet CBD",
    "county": "Bomet",
    "price": "KES 5,500 / month",
    "amenities": [
      "24/7 Security",
      "Wi-Fi",
      "Constant Water",
      "Study Lounges"
    ],
    "contactPhone": "+254 700 718763",
    "available": true,
    "image": "/images/housing/diverse-housing-29.jpg"
  },
  {
    "id": "h9",
    "name": "Cornerstone Bomet Courts",
    "universityId": "uni_bomet",
    "type": "hostel",
    "location": "Bomet CBD",
    "county": "Bomet",
    "price": "KES 8,500 / month",
    "amenities": [
      "Gym",
      "Cafeteria",
      "Study Rooms",
      "Constant Water",
      "CCTV"
    ],
    "contactPhone": "+254 700 657457",
    "available": true,
    "image": "/images/housing/diverse-housing-24.jpg"
  },
  {
    "id": "h10",
    "name": "Pwani Bungoma Courts",
    "universityId": "uni_bungoma",
    "type": "apartment",
    "location": "Bungoma CBD",
    "county": "Bungoma",
    "price": "KES 10,500 / month",
    "amenities": [
      "24/7 Security",
      "Wi-Fi",
      "Constant Water",
      "Study Lounges"
    ],
    "contactPhone": "+254 700 471231",
    "available": true,
    "image": "/images/housing/diverse-housing-15.jpg"
  },
  {
    "id": "h11",
    "name": "Varsity Bungoma Dorms",
    "universityId": "uni_bungoma",
    "type": "hostel",
    "location": "Bungoma CBD",
    "county": "Bungoma",
    "price": "KES 7,500 / month",
    "amenities": [
      "Spacious Rooms",
      "Balcony",
      "Secure Compound",
      "Borehole Water"
    ],
    "contactPhone": "+254 700 228992",
    "available": true,
    "image": "/images/housing/diverse-housing-23.jpg"
  },
  {
    "id": "h12",
    "name": "Sunrise Bungoma Residences",
    "universityId": "uni_bungoma",
    "type": "hostel",
    "location": "Bungoma CBD",
    "county": "Bungoma",
    "price": "KES 12,500 / month",
    "amenities": [
      "Spacious Rooms",
      "Balcony",
      "Secure Compound",
      "Borehole Water"
    ],
    "contactPhone": "+254 700 387376",
    "available": true,
    "image": "/images/housing/diverse-housing-19.jpg"
  },
  {
    "id": "h13",
    "name": "Royal Busia Courts",
    "universityId": "uni_busia",
    "type": "hostel",
    "location": "Busia CBD",
    "county": "Busia",
    "price": "KES 9,500 / month",
    "amenities": [
      "Wi-Fi",
      "Gym",
      "Study Rooms",
      "24/7 Security"
    ],
    "contactPhone": "+254 700 747563",
    "available": true,
    "image": "/images/housing/diverse-housing-29.jpg"
  },
  {
    "id": "h14",
    "name": "Cornerstone Busia Villas",
    "universityId": "uni_busia",
    "type": "hostel",
    "location": "Busia CBD",
    "county": "Busia",
    "price": "KES 9,500 / month",
    "amenities": [
      "En-suite bathrooms",
      "High-speed Wi-Fi",
      "CCTV",
      "Ample Parking"
    ],
    "contactPhone": "+254 700 993014",
    "available": true,
    "image": "/images/housing/diverse-housing-10.jpg"
  },
  {
    "id": "h15",
    "name": "Premier Elgeyo-Marakwet Villas",
    "universityId": "uni_elgeyomarakwet",
    "type": "hostel",
    "location": "Elgeyo-Marakwet CBD",
    "county": "Elgeyo-Marakwet",
    "price": "KES 5,500 / month",
    "amenities": [
      "En-suite bathrooms",
      "High-speed Wi-Fi",
      "CCTV",
      "Ample Parking"
    ],
    "contactPhone": "+254 700 461295",
    "available": true,
    "image": "/images/housing/diverse-housing-29.jpg"
  },
  {
    "id": "h16",
    "name": "Oasis Elgeyo-Marakwet Villas",
    "universityId": "uni_elgeyomarakwet",
    "type": "apartment",
    "location": "Elgeyo-Marakwet CBD",
    "county": "Elgeyo-Marakwet",
    "price": "KES 11,500 / month",
    "amenities": [
      "24/7 Security",
      "Wi-Fi",
      "Constant Water",
      "Study Lounges"
    ],
    "contactPhone": "+254 700 581929",
    "available": false,
    "image": "/images/housing/diverse-housing-13.jpg"
  },
  {
    "id": "h17",
    "name": "Varsity Elgeyo-Marakwet Lodge",
    "universityId": "uni_elgeyomarakwet",
    "type": "apartment",
    "location": "Elgeyo-Marakwet CBD",
    "county": "Elgeyo-Marakwet",
    "price": "KES 14,500 / month",
    "amenities": [
      "Gym",
      "Cafeteria",
      "Study Rooms",
      "Constant Water",
      "CCTV"
    ],
    "contactPhone": "+254 700 551588",
    "available": true,
    "image": "/images/housing/diverse-housing-11.jpg"
  },
  {
    "id": "h18",
    "name": "Royal Embu Dorms",
    "universityId": "uni_embu",
    "type": "hostel",
    "location": "Embu CBD",
    "county": "Embu",
    "price": "KES 13,500 / month",
    "amenities": [
      "Wi-Fi",
      "Gym",
      "Study Rooms",
      "24/7 Security"
    ],
    "contactPhone": "+254 700 336387",
    "available": true,
    "image": "/images/housing/diverse-housing-21.jpg"
  },
  {
    "id": "h19",
    "name": "Savannah Embu Lodge",
    "universityId": "uni_embu",
    "type": "hostel",
    "location": "Embu CBD",
    "county": "Embu",
    "price": "KES 6,500 / month",
    "amenities": [
      "En-suite bathrooms",
      "High-speed Wi-Fi",
      "CCTV",
      "Ample Parking"
    ],
    "contactPhone": "+254 700 743538",
    "available": true,
    "image": "/images/housing/diverse-housing-11.jpg"
  },
  {
    "id": "h20",
    "name": "Milestone Garissa Suites",
    "universityId": "uni_garissa",
    "type": "hostel",
    "location": "Garissa CBD",
    "county": "Garissa",
    "price": "KES 13,500 / month",
    "amenities": [
      "En-suite bathrooms",
      "High-speed Wi-Fi",
      "CCTV",
      "Ample Parking"
    ],
    "contactPhone": "+254 700 504858",
    "available": true,
    "image": "/images/housing/diverse-housing-27.jpg"
  },
  {
    "id": "h21",
    "name": "Savannah Garissa Residences",
    "universityId": "uni_garissa",
    "type": "hostel",
    "location": "Garissa CBD",
    "county": "Garissa",
    "price": "KES 11,500 / month",
    "amenities": [
      "En-suite bathrooms",
      "High-speed Wi-Fi",
      "CCTV",
      "Ample Parking"
    ],
    "contactPhone": "+254 700 820746",
    "available": true,
    "image": "/images/housing/diverse-housing-25.jpg"
  },
  {
    "id": "h22",
    "name": "Sunrise Garissa Dorms",
    "universityId": "uni_garissa",
    "type": "hostel",
    "location": "Garissa CBD",
    "county": "Garissa",
    "price": "KES 13,500 / month",
    "amenities": [
      "Gym",
      "Cafeteria",
      "Study Rooms",
      "Constant Water",
      "CCTV"
    ],
    "contactPhone": "+254 700 169748",
    "available": true,
    "image": "/images/housing/diverse-housing-22.jpg"
  },
  {
    "id": "h23",
    "name": "Central Homa Bay Courts",
    "universityId": "uni_homabay",
    "type": "hostel",
    "location": "Homa Bay CBD",
    "county": "Homa Bay",
    "price": "KES 12,500 / month",
    "amenities": [
      "En-suite bathrooms",
      "High-speed Wi-Fi",
      "CCTV",
      "Ample Parking"
    ],
    "contactPhone": "+254 700 589738",
    "available": true,
    "image": "/images/housing/diverse-housing-3.jpg"
  },
  {
    "id": "h24",
    "name": "Savannah Homa Bay Lodge",
    "universityId": "uni_homabay",
    "type": "hostel",
    "location": "Homa Bay CBD",
    "county": "Homa Bay",
    "price": "KES 6,500 / month",
    "amenities": [
      "24/7 Security",
      "Wi-Fi",
      "Constant Water",
      "Study Lounges"
    ],
    "contactPhone": "+254 700 944969",
    "available": true,
    "image": "/images/housing/diverse-housing-25.jpg"
  },
  {
    "id": "h25",
    "name": "Highland Isiolo Courts",
    "universityId": "uni_isiolo",
    "type": "hostel",
    "location": "Isiolo CBD",
    "county": "Isiolo",
    "price": "KES 13,500 / month",
    "amenities": [
      "Wi-Fi",
      "Recreation Room",
      "Backup Generator",
      "Shuttle Service"
    ],
    "contactPhone": "+254 700 550838",
    "available": true,
    "image": "/images/housing/diverse-housing-6.jpg"
  },
  {
    "id": "h26",
    "name": "Highland Isiolo Residences",
    "universityId": "uni_isiolo",
    "type": "hostel",
    "location": "Isiolo CBD",
    "county": "Isiolo",
    "price": "KES 9,500 / month",
    "amenities": [
      "Wi-Fi",
      "Gym",
      "Study Rooms",
      "24/7 Security"
    ],
    "contactPhone": "+254 700 284304",
    "available": true,
    "image": "/images/housing/diverse-housing-1.jpg"
  },
  {
    "id": "h27",
    "name": "Campus Isiolo Lodge",
    "universityId": "uni_isiolo",
    "type": "apartment",
    "location": "Isiolo CBD",
    "county": "Isiolo",
    "price": "KES 12,500 / month",
    "amenities": [
      "Wi-Fi",
      "Gym",
      "Study Rooms",
      "24/7 Security"
    ],
    "contactPhone": "+254 700 961022",
    "available": true,
    "image": "/images/housing/diverse-housing-18.jpg"
  },
  {
    "id": "h28",
    "name": "Victory Kajiado Suites",
    "universityId": "uni_kajiado",
    "type": "apartment",
    "location": "Kajiado CBD",
    "county": "Kajiado",
    "price": "KES 6,500 / month",
    "amenities": [
      "High-speed Wi-Fi",
      "Gym",
      "Backup Generator",
      "Shuttle Service",
      "24/7 Security",
      "Lounge"
    ],
    "contactPhone": "+254 700 146604",
    "available": true,
    "image": "/images/housing/diverse-housing-7.jpg"
  },
  {
    "id": "h29",
    "name": "Milestone Kajiado Courts",
    "universityId": "uni_kajiado",
    "type": "apartment",
    "location": "Kajiado CBD",
    "county": "Kajiado",
    "price": "KES 14,500 / month",
    "amenities": [
      "En-suite bathrooms",
      "High-speed Wi-Fi",
      "CCTV",
      "Ample Parking"
    ],
    "contactPhone": "+254 700 399447",
    "available": true,
    "image": "/images/housing/diverse-housing-28.jpg"
  },
  {
    "id": "h30",
    "name": "Central Kajiado Lodge",
    "universityId": "uni_kajiado",
    "type": "hostel",
    "location": "Kajiado CBD",
    "county": "Kajiado",
    "price": "KES 10,500 / month",
    "amenities": [
      "En-suite bathrooms",
      "High-speed Wi-Fi",
      "CCTV",
      "Ample Parking"
    ],
    "contactPhone": "+254 700 577908",
    "available": true,
    "image": "/images/housing/diverse-housing-7.jpg"
  },
  {
    "id": "h31",
    "name": "Savannah Kakamega Residences",
    "universityId": "uni_kakamega",
    "type": "apartment",
    "location": "Kakamega CBD",
    "county": "Kakamega",
    "price": "KES 14,500 / month",
    "amenities": [
      "24/7 Security",
      "Wi-Fi",
      "Constant Water",
      "Study Lounges"
    ],
    "contactPhone": "+254 700 228600",
    "available": true,
    "image": "/images/housing/diverse-housing-12.jpg"
  },
  {
    "id": "h32",
    "name": "Elite Kakamega Hostel",
    "universityId": "uni_kakamega",
    "type": "apartment",
    "location": "Kakamega CBD",
    "county": "Kakamega",
    "price": "KES 10,500 / month",
    "amenities": [
      "En-suite bathrooms",
      "High-speed Wi-Fi",
      "CCTV",
      "Ample Parking"
    ],
    "contactPhone": "+254 700 717957",
    "available": true,
    "image": "/images/housing/diverse-housing-15.jpg"
  },
  {
    "id": "h33",
    "name": "City Kericho Courts",
    "universityId": "uni_kericho",
    "type": "hostel",
    "location": "Kericho CBD",
    "county": "Kericho",
    "price": "KES 14,500 / month",
    "amenities": [
      "High-speed Wi-Fi",
      "Gym",
      "Backup Generator",
      "Shuttle Service",
      "24/7 Security",
      "Lounge"
    ],
    "contactPhone": "+254 700 529462",
    "available": true,
    "image": "/images/housing/diverse-housing-15.jpg"
  },
  {
    "id": "h34",
    "name": "Valley Kericho Residences",
    "universityId": "uni_kericho",
    "type": "apartment",
    "location": "Kericho CBD",
    "county": "Kericho",
    "price": "KES 5,500 / month",
    "amenities": [
      "Wi-Fi",
      "Gym",
      "Study Rooms",
      "24/7 Security"
    ],
    "contactPhone": "+254 700 839125",
    "available": true,
    "image": "/images/housing/diverse-housing-16.jpg"
  },
  {
    "id": "h35",
    "name": "Premier Kericho Dorms",
    "universityId": "uni_kericho",
    "type": "hostel",
    "location": "Kericho CBD",
    "county": "Kericho",
    "price": "KES 9,500 / month",
    "amenities": [
      "En-suite bathrooms",
      "High-speed Wi-Fi",
      "CCTV",
      "Ample Parking"
    ],
    "contactPhone": "+254 700 868332",
    "available": true,
    "image": "/images/housing/diverse-housing-7.jpg"
  },
  {
    "id": "h36",
    "name": "Victory Kiambu Courts",
    "universityId": "uni_kiambu",
    "type": "hostel",
    "location": "Kiambu CBD",
    "county": "Kiambu",
    "price": "KES 12,500 / month",
    "amenities": [
      "High-speed Wi-Fi",
      "Gym",
      "Backup Generator",
      "Shuttle Service",
      "24/7 Security",
      "Lounge"
    ],
    "contactPhone": "+254 700 156267",
    "available": true,
    "image": "/images/housing/diverse-housing-1.jpg"
  },
  {
    "id": "h37",
    "name": "Valley Kiambu Apartments",
    "universityId": "uni_kiambu",
    "type": "apartment",
    "location": "Kiambu CBD",
    "county": "Kiambu",
    "price": "KES 6,500 / month",
    "amenities": [
      "Spacious Rooms",
      "Balcony",
      "Secure Compound",
      "Borehole Water"
    ],
    "contactPhone": "+254 700 376570",
    "available": false,
    "image": "/images/housing/diverse-housing-13.jpg"
  },
  {
    "id": "h38",
    "name": "Milestone Kiambu Residences",
    "universityId": "uni_kiambu",
    "type": "apartment",
    "location": "Kiambu CBD",
    "county": "Kiambu",
    "price": "KES 12,500 / month",
    "amenities": [
      "Spacious Rooms",
      "Balcony",
      "Secure Compound",
      "Borehole Water"
    ],
    "contactPhone": "+254 700 899091",
    "available": true,
    "image": "/images/housing/diverse-housing-19.jpg"
  },
  {
    "id": "h39",
    "name": "Valley Kilifi Suites",
    "universityId": "uni_kilifi",
    "type": "apartment",
    "location": "Kilifi CBD",
    "county": "Kilifi",
    "price": "KES 9,500 / month",
    "amenities": [
      "Wi-Fi",
      "Recreation Room",
      "Backup Generator",
      "Shuttle Service"
    ],
    "contactPhone": "+254 700 648944",
    "available": true,
    "image": "/images/housing/diverse-housing-8.jpg"
  },
  {
    "id": "h40",
    "name": "Valley Kilifi Suites",
    "universityId": "uni_kilifi",
    "type": "hostel",
    "location": "Kilifi CBD",
    "county": "Kilifi",
    "price": "KES 9,500 / month",
    "amenities": [
      "En-suite bathrooms",
      "High-speed Wi-Fi",
      "CCTV",
      "Ample Parking"
    ],
    "contactPhone": "+254 700 256813",
    "available": true,
    "image": "/images/housing/diverse-housing-12.jpg"
  },
  {
    "id": "h41",
    "name": "Pwani Kirinyaga Residences",
    "universityId": "uni_kirinyaga",
    "type": "hostel",
    "location": "Kirinyaga CBD",
    "county": "Kirinyaga",
    "price": "KES 12,500 / month",
    "amenities": [
      "En-suite bathrooms",
      "High-speed Wi-Fi",
      "CCTV",
      "Ample Parking"
    ],
    "contactPhone": "+254 700 537778",
    "available": true,
    "image": "/images/housing/diverse-housing-21.jpg"
  },
  {
    "id": "h42",
    "name": "Milestone Kirinyaga Lodge",
    "universityId": "uni_kirinyaga",
    "type": "hostel",
    "location": "Kirinyaga CBD",
    "county": "Kirinyaga",
    "price": "KES 12,500 / month",
    "amenities": [
      "Spacious Rooms",
      "Balcony",
      "Secure Compound",
      "Borehole Water"
    ],
    "contactPhone": "+254 700 476198",
    "available": true,
    "image": "/images/housing/diverse-housing-29.jpg"
  },
  {
    "id": "h43",
    "name": "Royal Kirinyaga Residences",
    "universityId": "uni_kirinyaga",
    "type": "apartment",
    "location": "Kirinyaga CBD",
    "county": "Kirinyaga",
    "price": "KES 9,500 / month",
    "amenities": [
      "Spacious Rooms",
      "Balcony",
      "Secure Compound",
      "Borehole Water"
    ],
    "contactPhone": "+254 700 199882",
    "available": true,
    "image": "/images/housing/diverse-housing-19.jpg"
  },
  {
    "id": "h44",
    "name": "Pwani Kisii Hostel",
    "universityId": "uni_kisii",
    "type": "hostel",
    "location": "Kisii CBD",
    "county": "Kisii",
    "price": "KES 5,500 / month",
    "amenities": [
      "Wi-Fi",
      "Recreation Room",
      "Backup Generator",
      "Shuttle Service"
    ],
    "contactPhone": "+254 700 647008",
    "available": false,
    "image": "/images/housing/diverse-housing-14.jpg"
  },
  {
    "id": "h45",
    "name": "Valley Kisii Suites",
    "universityId": "uni_kisii",
    "type": "hostel",
    "location": "Kisii CBD",
    "county": "Kisii",
    "price": "KES 7,500 / month",
    "amenities": [
      "Wi-Fi",
      "Recreation Room",
      "Backup Generator",
      "Shuttle Service"
    ],
    "contactPhone": "+254 700 177478",
    "available": true,
    "image": "/images/housing/diverse-housing-25.jpg"
  },
  {
    "id": "h46",
    "name": "Valley Kisii Residences",
    "universityId": "uni_kisii",
    "type": "hostel",
    "location": "Kisii CBD",
    "county": "Kisii",
    "price": "KES 5,500 / month",
    "amenities": [
      "Gym",
      "Cafeteria",
      "Study Rooms",
      "Constant Water",
      "CCTV"
    ],
    "contactPhone": "+254 700 739928",
    "available": true,
    "image": "/images/housing/diverse-housing-3.jpg"
  },
  {
    "id": "h47",
    "name": "Lakeside Kisumu Courts",
    "universityId": "uni_kisumu",
    "type": "hostel",
    "location": "Kisumu CBD",
    "county": "Kisumu",
    "price": "KES 14,500 / month",
    "amenities": [
      "Wi-Fi",
      "Gym",
      "Study Rooms",
      "24/7 Security"
    ],
    "contactPhone": "+254 700 727371",
    "available": true,
    "image": "/images/housing/diverse-housing-2.jpg"
  },
  {
    "id": "h48",
    "name": "Lakeside Kisumu Dorms",
    "universityId": "uni_kisumu",
    "type": "apartment",
    "location": "Kisumu CBD",
    "county": "Kisumu",
    "price": "KES 12,500 / month",
    "amenities": [
      "24/7 Security",
      "Wi-Fi",
      "Constant Water",
      "Study Lounges"
    ],
    "contactPhone": "+254 700 843834",
    "available": true,
    "image": "/images/housing/diverse-housing-6.jpg"
  },
  {
    "id": "h49",
    "name": "Pwani Kisumu Courts",
    "universityId": "uni_kisumu",
    "type": "hostel",
    "location": "Kisumu CBD",
    "county": "Kisumu",
    "price": "KES 10,500 / month",
    "amenities": [
      "Wi-Fi",
      "Recreation Room",
      "Backup Generator",
      "Shuttle Service"
    ],
    "contactPhone": "+254 700 914122",
    "available": true,
    "image": "/images/housing/diverse-housing-23.jpg"
  },
  {
    "id": "h50",
    "name": "Premier Kitui Dorms",
    "universityId": "uni_kitui",
    "type": "apartment",
    "location": "Kitui CBD",
    "county": "Kitui",
    "price": "KES 9,500 / month",
    "amenities": [
      "Wi-Fi",
      "Gym",
      "Study Rooms",
      "24/7 Security"
    ],
    "contactPhone": "+254 700 282765",
    "available": true,
    "image": "/images/housing/diverse-housing-4.jpg"
  },
  {
    "id": "h51",
    "name": "Lakeside Kitui Apartments",
    "universityId": "uni_kitui",
    "type": "apartment",
    "location": "Kitui CBD",
    "county": "Kitui",
    "price": "KES 5,500 / month",
    "amenities": [
      "High-speed Wi-Fi",
      "Gym",
      "Backup Generator",
      "Shuttle Service",
      "24/7 Security",
      "Lounge"
    ],
    "contactPhone": "+254 700 417487",
    "available": false,
    "image": "/images/housing/diverse-housing-4.jpg"
  },
  {
    "id": "h52",
    "name": "Pioneer Kitui Apartments",
    "universityId": "uni_kitui",
    "type": "apartment",
    "location": "Kitui CBD",
    "county": "Kitui",
    "price": "KES 9,500 / month",
    "amenities": [
      "Gym",
      "Cafeteria",
      "Study Rooms",
      "Constant Water",
      "CCTV"
    ],
    "contactPhone": "+254 700 435163",
    "available": true,
    "image": "/images/housing/diverse-housing-10.jpg"
  },
  {
    "id": "h53",
    "name": "Campus Kwale Courts",
    "universityId": "uni_kwale",
    "type": "apartment",
    "location": "Kwale CBD",
    "county": "Kwale",
    "price": "KES 7,500 / month",
    "amenities": [
      "Gym",
      "Cafeteria",
      "Study Rooms",
      "Constant Water",
      "CCTV"
    ],
    "contactPhone": "+254 700 428459",
    "available": true,
    "image": "/images/housing/diverse-housing-19.jpg"
  },
  {
    "id": "h54",
    "name": "Cornerstone Kwale Hostel",
    "universityId": "uni_kwale",
    "type": "apartment",
    "location": "Kwale CBD",
    "county": "Kwale",
    "price": "KES 8,500 / month",
    "amenities": [
      "High-speed Wi-Fi",
      "Gym",
      "Backup Generator",
      "Shuttle Service",
      "24/7 Security",
      "Lounge"
    ],
    "contactPhone": "+254 700 973841",
    "available": true,
    "image": "/images/housing/diverse-housing-6.jpg"
  },
  {
    "id": "h55",
    "name": "Victory Laikipia Suites",
    "universityId": "uni_laikipia",
    "type": "apartment",
    "location": "Laikipia CBD",
    "county": "Laikipia",
    "price": "KES 5,500 / month",
    "amenities": [
      "En-suite bathrooms",
      "High-speed Wi-Fi",
      "CCTV",
      "Ample Parking"
    ],
    "contactPhone": "+254 700 786621",
    "available": true,
    "image": "/images/housing/diverse-housing-17.jpg"
  },
  {
    "id": "h56",
    "name": "Valley Laikipia Suites",
    "universityId": "uni_laikipia",
    "type": "apartment",
    "location": "Laikipia CBD",
    "county": "Laikipia",
    "price": "KES 9,500 / month",
    "amenities": [
      "High-speed Wi-Fi",
      "Gym",
      "Backup Generator",
      "Shuttle Service",
      "24/7 Security",
      "Lounge"
    ],
    "contactPhone": "+254 700 814587",
    "available": true,
    "image": "/images/housing/diverse-housing-9.jpg"
  },
  {
    "id": "h57",
    "name": "Campus Lamu Lodge",
    "universityId": "uni_lamu",
    "type": "hostel",
    "location": "Lamu CBD",
    "county": "Lamu",
    "price": "KES 10,500 / month",
    "amenities": [
      "En-suite bathrooms",
      "High-speed Wi-Fi",
      "CCTV",
      "Ample Parking"
    ],
    "contactPhone": "+254 700 812851",
    "available": true,
    "image": "/images/housing/diverse-housing-24.jpg"
  },
  {
    "id": "h58",
    "name": "Highland Lamu Courts",
    "universityId": "uni_lamu",
    "type": "apartment",
    "location": "Lamu CBD",
    "county": "Lamu",
    "price": "KES 8,500 / month",
    "amenities": [
      "Spacious Rooms",
      "Balcony",
      "Secure Compound",
      "Borehole Water"
    ],
    "contactPhone": "+254 700 604481",
    "available": true,
    "image": "/images/housing/diverse-housing-2.jpg"
  },
  {
    "id": "h59",
    "name": "Savannah Machakos Residences",
    "universityId": "uni_machakos",
    "type": "apartment",
    "location": "Machakos CBD",
    "county": "Machakos",
    "price": "KES 14,500 / month",
    "amenities": [
      "High-speed Wi-Fi",
      "Gym",
      "Backup Generator",
      "Shuttle Service",
      "24/7 Security",
      "Lounge"
    ],
    "contactPhone": "+254 700 753570",
    "available": true,
    "image": "/images/housing/diverse-housing-11.jpg"
  },
  {
    "id": "h60",
    "name": "City Machakos Courts",
    "universityId": "uni_machakos",
    "type": "apartment",
    "location": "Machakos CBD",
    "county": "Machakos",
    "price": "KES 13,500 / month",
    "amenities": [
      "Spacious Rooms",
      "Balcony",
      "Secure Compound",
      "Borehole Water"
    ],
    "contactPhone": "+254 700 489085",
    "available": true,
    "image": "/images/housing/diverse-housing-11.jpg"
  },
  {
    "id": "h61",
    "name": "Valley Machakos Lodge",
    "universityId": "uni_machakos",
    "type": "hostel",
    "location": "Machakos CBD",
    "county": "Machakos",
    "price": "KES 5,500 / month",
    "amenities": [
      "Wi-Fi",
      "Recreation Room",
      "Backup Generator",
      "Shuttle Service"
    ],
    "contactPhone": "+254 700 323732",
    "available": false,
    "image": "/images/housing/diverse-housing-22.jpg"
  },
  {
    "id": "h62",
    "name": "Campus Makueni Courts",
    "universityId": "uni_makueni",
    "type": "hostel",
    "location": "Makueni CBD",
    "county": "Makueni",
    "price": "KES 9,500 / month",
    "amenities": [
      "Wi-Fi",
      "Gym",
      "Study Rooms",
      "24/7 Security"
    ],
    "contactPhone": "+254 700 359248",
    "available": true,
    "image": "/images/housing/diverse-housing-19.jpg"
  },
  {
    "id": "h63",
    "name": "Varsity Makueni Courts",
    "universityId": "uni_makueni",
    "type": "hostel",
    "location": "Makueni CBD",
    "county": "Makueni",
    "price": "KES 7,500 / month",
    "amenities": [
      "24/7 Security",
      "Wi-Fi",
      "Constant Water",
      "Study Lounges"
    ],
    "contactPhone": "+254 700 848619",
    "available": true,
    "image": "/images/housing/diverse-housing-11.jpg"
  },
  {
    "id": "h64",
    "name": "Pwani Makueni Suites",
    "universityId": "uni_makueni",
    "type": "apartment",
    "location": "Makueni CBD",
    "county": "Makueni",
    "price": "KES 13,500 / month",
    "amenities": [
      "High-speed Wi-Fi",
      "Gym",
      "Backup Generator",
      "Shuttle Service",
      "24/7 Security",
      "Lounge"
    ],
    "contactPhone": "+254 700 541019",
    "available": true,
    "image": "/images/housing/diverse-housing-11.jpg"
  },
  {
    "id": "h65",
    "name": "Pioneer Mandera Hostel",
    "universityId": "uni_mandera",
    "type": "hostel",
    "location": "Mandera CBD",
    "county": "Mandera",
    "price": "KES 12,500 / month",
    "amenities": [
      "En-suite bathrooms",
      "High-speed Wi-Fi",
      "CCTV",
      "Ample Parking"
    ],
    "contactPhone": "+254 700 712145",
    "available": false,
    "image": "/images/housing/diverse-housing-6.jpg"
  },
  {
    "id": "h66",
    "name": "Premier Mandera Suites",
    "universityId": "uni_mandera",
    "type": "apartment",
    "location": "Mandera CBD",
    "county": "Mandera",
    "price": "KES 9,500 / month",
    "amenities": [
      "Spacious Rooms",
      "Balcony",
      "Secure Compound",
      "Borehole Water"
    ],
    "contactPhone": "+254 700 893897",
    "available": true,
    "image": "/images/housing/diverse-housing-30.jpg"
  },
  {
    "id": "h67",
    "name": "Elite Marsabit Hostel",
    "universityId": "uni_marsabit",
    "type": "hostel",
    "location": "Marsabit CBD",
    "county": "Marsabit",
    "price": "KES 7,500 / month",
    "amenities": [
      "En-suite bathrooms",
      "High-speed Wi-Fi",
      "CCTV",
      "Ample Parking"
    ],
    "contactPhone": "+254 700 561769",
    "available": true,
    "image": "/images/housing/diverse-housing-7.jpg"
  },
  {
    "id": "h68",
    "name": "Pioneer Marsabit Residences",
    "universityId": "uni_marsabit",
    "type": "apartment",
    "location": "Marsabit CBD",
    "county": "Marsabit",
    "price": "KES 11,500 / month",
    "amenities": [
      "24/7 Security",
      "Wi-Fi",
      "Constant Water",
      "Study Lounges"
    ],
    "contactPhone": "+254 700 110246",
    "available": true,
    "image": "/images/housing/diverse-housing-11.jpg"
  },
  {
    "id": "h69",
    "name": "Premier Marsabit Courts",
    "universityId": "uni_marsabit",
    "type": "hostel",
    "location": "Marsabit CBD",
    "county": "Marsabit",
    "price": "KES 8,500 / month",
    "amenities": [
      "Gym",
      "Cafeteria",
      "Study Rooms",
      "Constant Water",
      "CCTV"
    ],
    "contactPhone": "+254 700 895423",
    "available": true,
    "image": "/images/housing/diverse-housing-26.jpg"
  },
  {
    "id": "h70",
    "name": "Valley Meru Villas",
    "universityId": "uni_meru",
    "type": "hostel",
    "location": "Meru CBD",
    "county": "Meru",
    "price": "KES 11,500 / month",
    "amenities": [
      "Spacious Rooms",
      "Balcony",
      "Secure Compound",
      "Borehole Water"
    ],
    "contactPhone": "+254 700 824018",
    "available": false,
    "image": "/images/housing/diverse-housing-21.jpg"
  },
  {
    "id": "h71",
    "name": "Victory Meru Suites",
    "universityId": "uni_meru",
    "type": "hostel",
    "location": "Meru CBD",
    "county": "Meru",
    "price": "KES 11,500 / month",
    "amenities": [
      "Spacious Rooms",
      "Balcony",
      "Secure Compound",
      "Borehole Water"
    ],
    "contactPhone": "+254 700 587393",
    "available": true,
    "image": "/images/housing/diverse-housing-15.jpg"
  },
  {
    "id": "h72",
    "name": "Sunrise Migori Suites",
    "universityId": "uni_migori",
    "type": "hostel",
    "location": "Migori CBD",
    "county": "Migori",
    "price": "KES 5,500 / month",
    "amenities": [
      "Wi-Fi",
      "Recreation Room",
      "Backup Generator",
      "Shuttle Service"
    ],
    "contactPhone": "+254 700 879775",
    "available": true,
    "image": "/images/housing/diverse-housing-11.jpg"
  },
  {
    "id": "h73",
    "name": "Premier Migori Suites",
    "universityId": "uni_migori",
    "type": "apartment",
    "location": "Migori CBD",
    "county": "Migori",
    "price": "KES 14,500 / month",
    "amenities": [
      "Wi-Fi",
      "Recreation Room",
      "Backup Generator",
      "Shuttle Service"
    ],
    "contactPhone": "+254 700 113299",
    "available": true,
    "image": "/images/housing/diverse-housing-19.jpg"
  },
  {
    "id": "h74",
    "name": "Pwani Migori Residences",
    "universityId": "uni_migori",
    "type": "apartment",
    "location": "Migori CBD",
    "county": "Migori",
    "price": "KES 5,500 / month",
    "amenities": [
      "Wi-Fi",
      "Gym",
      "Study Rooms",
      "24/7 Security"
    ],
    "contactPhone": "+254 700 905505",
    "available": false,
    "image": "/images/housing/diverse-housing-13.jpg"
  },
  {
    "id": "h75",
    "name": "Campus Mombasa Courts",
    "universityId": "uni_mombasa",
    "type": "apartment",
    "location": "Mombasa CBD",
    "county": "Mombasa",
    "price": "KES 9,500 / month",
    "amenities": [
      "Gym",
      "Cafeteria",
      "Study Rooms",
      "Constant Water",
      "CCTV"
    ],
    "contactPhone": "+254 700 828338",
    "available": true,
    "image": "/images/housing/diverse-housing-29.jpg"
  },
  {
    "id": "h76",
    "name": "Sunrise Mombasa Villas",
    "universityId": "uni_mombasa",
    "type": "apartment",
    "location": "Mombasa CBD",
    "county": "Mombasa",
    "price": "KES 13,500 / month",
    "amenities": [
      "Wi-Fi",
      "Gym",
      "Study Rooms",
      "24/7 Security"
    ],
    "contactPhone": "+254 700 597329",
    "available": true,
    "image": "/images/housing/diverse-housing-4.jpg"
  },
  {
    "id": "h77",
    "name": "Premier Mombasa Apartments",
    "universityId": "uni_mombasa",
    "type": "hostel",
    "location": "Mombasa CBD",
    "county": "Mombasa",
    "price": "KES 12,500 / month",
    "amenities": [
      "Spacious Rooms",
      "Balcony",
      "Secure Compound",
      "Borehole Water"
    ],
    "contactPhone": "+254 700 999111",
    "available": true,
    "image": "/images/housing/diverse-housing-26.jpg"
  },
  {
    "id": "h78",
    "name": "City Murang'a Residences",
    "universityId": "uni_muranga",
    "type": "hostel",
    "location": "Murang'a CBD",
    "county": "Murang'a",
    "price": "KES 8,500 / month",
    "amenities": [
      "24/7 Security",
      "Wi-Fi",
      "Constant Water",
      "Study Lounges"
    ],
    "contactPhone": "+254 700 478024",
    "available": true,
    "image": "/images/housing/diverse-housing-22.jpg"
  },
  {
    "id": "h79",
    "name": "Savannah Murang'a Dorms",
    "universityId": "uni_muranga",
    "type": "hostel",
    "location": "Murang'a CBD",
    "county": "Murang'a",
    "price": "KES 10,500 / month",
    "amenities": [
      "Spacious Rooms",
      "Balcony",
      "Secure Compound",
      "Borehole Water"
    ],
    "contactPhone": "+254 700 816451",
    "available": true,
    "image": "/images/housing/diverse-housing-21.jpg"
  },
  {
    "id": "h80",
    "name": "Varsity Murang'a Courts",
    "universityId": "uni_muranga",
    "type": "apartment",
    "location": "Murang'a CBD",
    "county": "Murang'a",
    "price": "KES 9,500 / month",
    "amenities": [
      "Wi-Fi",
      "Gym",
      "Study Rooms",
      "24/7 Security"
    ],
    "contactPhone": "+254 700 613770",
    "available": true,
    "image": "/images/housing/diverse-housing-8.jpg"
  },
  {
    "id": "h81",
    "name": "Premier Nakuru Dorms",
    "universityId": "uni_nakuru",
    "type": "apartment",
    "location": "Nakuru CBD",
    "county": "Nakuru",
    "price": "KES 11,500 / month",
    "amenities": [
      "Wi-Fi",
      "Gym",
      "Study Rooms",
      "24/7 Security"
    ],
    "contactPhone": "+254 700 233005",
    "available": true,
    "image": "/images/housing/diverse-housing-6.jpg"
  },
  {
    "id": "h82",
    "name": "Victory Nakuru Lodge",
    "universityId": "uni_nakuru",
    "type": "apartment",
    "location": "Nakuru CBD",
    "county": "Nakuru",
    "price": "KES 13,500 / month",
    "amenities": [
      "24/7 Security",
      "Wi-Fi",
      "Constant Water",
      "Study Lounges"
    ],
    "contactPhone": "+254 700 533470",
    "available": true,
    "image": "/images/housing/diverse-housing-2.jpg"
  },
  {
    "id": "h83",
    "name": "Milestone Nandi Lodge",
    "universityId": "uni_nandi",
    "type": "hostel",
    "location": "Nandi CBD",
    "county": "Nandi",
    "price": "KES 7,500 / month",
    "amenities": [
      "Spacious Rooms",
      "Balcony",
      "Secure Compound",
      "Borehole Water"
    ],
    "contactPhone": "+254 700 587135",
    "available": true,
    "image": "/images/housing/diverse-housing-9.jpg"
  },
  {
    "id": "h84",
    "name": "Royal Nandi Courts",
    "universityId": "uni_nandi",
    "type": "hostel",
    "location": "Nandi CBD",
    "county": "Nandi",
    "price": "KES 13,500 / month",
    "amenities": [
      "High-speed Wi-Fi",
      "Gym",
      "Backup Generator",
      "Shuttle Service",
      "24/7 Security",
      "Lounge"
    ],
    "contactPhone": "+254 700 255017",
    "available": true,
    "image": "/images/housing/diverse-housing-16.jpg"
  },
  {
    "id": "h85",
    "name": "Valley Narok Suites",
    "universityId": "uni_narok",
    "type": "hostel",
    "location": "Narok CBD",
    "county": "Narok",
    "price": "KES 11,500 / month",
    "amenities": [
      "En-suite bathrooms",
      "High-speed Wi-Fi",
      "CCTV",
      "Ample Parking"
    ],
    "contactPhone": "+254 700 323275",
    "available": true,
    "image": "/images/housing/diverse-housing-22.jpg"
  },
  {
    "id": "h86",
    "name": "Lakeside Narok Villas",
    "universityId": "uni_narok",
    "type": "apartment",
    "location": "Narok CBD",
    "county": "Narok",
    "price": "KES 8,500 / month",
    "amenities": [
      "Wi-Fi",
      "Gym",
      "Study Rooms",
      "24/7 Security"
    ],
    "contactPhone": "+254 700 321305",
    "available": true,
    "image": "/images/housing/diverse-housing-13.jpg"
  },
  {
    "id": "h87",
    "name": "Oasis Nyamira Hostel",
    "universityId": "uni_nyamira",
    "type": "apartment",
    "location": "Nyamira CBD",
    "county": "Nyamira",
    "price": "KES 7,500 / month",
    "amenities": [
      "Gym",
      "Cafeteria",
      "Study Rooms",
      "Constant Water",
      "CCTV"
    ],
    "contactPhone": "+254 700 590753",
    "available": true,
    "image": "/images/housing/diverse-housing-19.jpg"
  },
  {
    "id": "h88",
    "name": "Oasis Nyamira Residences",
    "universityId": "uni_nyamira",
    "type": "apartment",
    "location": "Nyamira CBD",
    "county": "Nyamira",
    "price": "KES 12,500 / month",
    "amenities": [
      "High-speed Wi-Fi",
      "Gym",
      "Backup Generator",
      "Shuttle Service",
      "24/7 Security",
      "Lounge"
    ],
    "contactPhone": "+254 700 992493",
    "available": true,
    "image": "/images/housing/diverse-housing-4.jpg"
  },
  {
    "id": "h89",
    "name": "Victory Nyamira Residences",
    "universityId": "uni_nyamira",
    "type": "apartment",
    "location": "Nyamira CBD",
    "county": "Nyamira",
    "price": "KES 9,500 / month",
    "amenities": [
      "Wi-Fi",
      "Gym",
      "Study Rooms",
      "24/7 Security"
    ],
    "contactPhone": "+254 700 273343",
    "available": true,
    "image": "/images/housing/diverse-housing-5.jpg"
  },
  {
    "id": "h90",
    "name": "Milestone Nyandarua Lodge",
    "universityId": "uni_nyandarua",
    "type": "apartment",
    "location": "Nyandarua CBD",
    "county": "Nyandarua",
    "price": "KES 6,500 / month",
    "amenities": [
      "Wi-Fi",
      "Gym",
      "Study Rooms",
      "24/7 Security"
    ],
    "contactPhone": "+254 700 103447",
    "available": true,
    "image": "/images/housing/diverse-housing-9.jpg"
  },
  {
    "id": "h91",
    "name": "Premier Nyandarua Hostel",
    "universityId": "uni_nyandarua",
    "type": "apartment",
    "location": "Nyandarua CBD",
    "county": "Nyandarua",
    "price": "KES 8,500 / month",
    "amenities": [
      "High-speed Wi-Fi",
      "Gym",
      "Backup Generator",
      "Shuttle Service",
      "24/7 Security",
      "Lounge"
    ],
    "contactPhone": "+254 700 238811",
    "available": true,
    "image": "/images/housing/diverse-housing-19.jpg"
  },
  {
    "id": "h92",
    "name": "Pioneer Nyandarua Lodge",
    "universityId": "uni_nyandarua",
    "type": "apartment",
    "location": "Nyandarua CBD",
    "county": "Nyandarua",
    "price": "KES 5,500 / month",
    "amenities": [
      "Gym",
      "Cafeteria",
      "Study Rooms",
      "Constant Water",
      "CCTV"
    ],
    "contactPhone": "+254 700 705554",
    "available": true,
    "image": "/images/housing/diverse-housing-10.jpg"
  },
  {
    "id": "h93",
    "name": "Lakeside Nyeri Courts",
    "universityId": "uni_nyeri",
    "type": "hostel",
    "location": "Nyeri CBD",
    "county": "Nyeri",
    "price": "KES 7,500 / month",
    "amenities": [
      "High-speed Wi-Fi",
      "Gym",
      "Backup Generator",
      "Shuttle Service",
      "24/7 Security",
      "Lounge"
    ],
    "contactPhone": "+254 700 763057",
    "available": true,
    "image": "/images/housing/diverse-housing-23.jpg"
  },
  {
    "id": "h94",
    "name": "City Nyeri Residences",
    "universityId": "uni_nyeri",
    "type": "hostel",
    "location": "Nyeri CBD",
    "county": "Nyeri",
    "price": "KES 5,500 / month",
    "amenities": [
      "24/7 Security",
      "Wi-Fi",
      "Constant Water",
      "Study Lounges"
    ],
    "contactPhone": "+254 700 161339",
    "available": true,
    "image": "/images/housing/diverse-housing-8.jpg"
  },
  {
    "id": "h95",
    "name": "Highland Nyeri Suites",
    "universityId": "uni_nyeri",
    "type": "apartment",
    "location": "Nyeri CBD",
    "county": "Nyeri",
    "price": "KES 8,500 / month",
    "amenities": [
      "Wi-Fi",
      "Recreation Room",
      "Backup Generator",
      "Shuttle Service"
    ],
    "contactPhone": "+254 700 422333",
    "available": true,
    "image": "/images/housing/diverse-housing-24.jpg"
  },
  {
    "id": "h96",
    "name": "Valley Samburu Apartments",
    "universityId": "uni_samburu",
    "type": "hostel",
    "location": "Samburu CBD",
    "county": "Samburu",
    "price": "KES 7,500 / month",
    "amenities": [
      "Wi-Fi",
      "Gym",
      "Study Rooms",
      "24/7 Security"
    ],
    "contactPhone": "+254 700 675459",
    "available": true,
    "image": "/images/housing/diverse-housing-8.jpg"
  },
  {
    "id": "h97",
    "name": "Lakeside Samburu Residences",
    "universityId": "uni_samburu",
    "type": "hostel",
    "location": "Samburu CBD",
    "county": "Samburu",
    "price": "KES 14,500 / month",
    "amenities": [
      "Gym",
      "Cafeteria",
      "Study Rooms",
      "Constant Water",
      "CCTV"
    ],
    "contactPhone": "+254 700 153317",
    "available": true,
    "image": "/images/housing/diverse-housing-14.jpg"
  },
  {
    "id": "h98",
    "name": "Varsity Samburu Dorms",
    "universityId": "uni_samburu",
    "type": "apartment",
    "location": "Samburu CBD",
    "county": "Samburu",
    "price": "KES 10,500 / month",
    "amenities": [
      "Wi-Fi",
      "Gym",
      "Study Rooms",
      "24/7 Security"
    ],
    "contactPhone": "+254 700 544136",
    "available": true,
    "image": "/images/housing/diverse-housing-18.jpg"
  },
  {
    "id": "h99",
    "name": "Oasis Siaya Lodge",
    "universityId": "uni_siaya",
    "type": "hostel",
    "location": "Siaya CBD",
    "county": "Siaya",
    "price": "KES 7,500 / month",
    "amenities": [
      "Wi-Fi",
      "Gym",
      "Study Rooms",
      "24/7 Security"
    ],
    "contactPhone": "+254 700 830233",
    "available": true,
    "image": "/images/housing/diverse-housing-27.jpg"
  },
  {
    "id": "h100",
    "name": "Victory Siaya Dorms",
    "universityId": "uni_siaya",
    "type": "hostel",
    "location": "Siaya CBD",
    "county": "Siaya",
    "price": "KES 12,500 / month",
    "amenities": [
      "Wi-Fi",
      "Recreation Room",
      "Backup Generator",
      "Shuttle Service"
    ],
    "contactPhone": "+254 700 828458",
    "available": true,
    "image": "/images/housing/diverse-housing-21.jpg"
  },
  {
    "id": "h101",
    "name": "Cornerstone Taita-Taveta Suites",
    "universityId": "uni_taitataveta",
    "type": "hostel",
    "location": "Taita-Taveta CBD",
    "county": "Taita-Taveta",
    "price": "KES 14,500 / month",
    "amenities": [
      "Gym",
      "Cafeteria",
      "Study Rooms",
      "Constant Water",
      "CCTV"
    ],
    "contactPhone": "+254 700 453004",
    "available": true,
    "image": "/images/housing/diverse-housing-29.jpg"
  },
  {
    "id": "h102",
    "name": "Royal Taita-Taveta Dorms",
    "universityId": "uni_taitataveta",
    "type": "hostel",
    "location": "Taita-Taveta CBD",
    "county": "Taita-Taveta",
    "price": "KES 13,500 / month",
    "amenities": [
      "High-speed Wi-Fi",
      "Gym",
      "Backup Generator",
      "Shuttle Service",
      "24/7 Security",
      "Lounge"
    ],
    "contactPhone": "+254 700 895672",
    "available": true,
    "image": "/images/housing/diverse-housing-25.jpg"
  },
  {
    "id": "h103",
    "name": "Varsity Taita-Taveta Hostel",
    "universityId": "uni_taitataveta",
    "type": "apartment",
    "location": "Taita-Taveta CBD",
    "county": "Taita-Taveta",
    "price": "KES 7,500 / month",
    "amenities": [
      "Wi-Fi",
      "Gym",
      "Study Rooms",
      "24/7 Security"
    ],
    "contactPhone": "+254 700 744426",
    "available": true,
    "image": "/images/housing/diverse-housing-21.jpg"
  },
  {
    "id": "h104",
    "name": "Royal Tana River Courts",
    "universityId": "uni_tanariver",
    "type": "apartment",
    "location": "Tana River CBD",
    "county": "Tana River",
    "price": "KES 8,500 / month",
    "amenities": [
      "Wi-Fi",
      "Recreation Room",
      "Backup Generator",
      "Shuttle Service"
    ],
    "contactPhone": "+254 700 264825",
    "available": true,
    "image": "/images/housing/diverse-housing-2.jpg"
  },
  {
    "id": "h105",
    "name": "Cornerstone Tana River Suites",
    "universityId": "uni_tanariver",
    "type": "hostel",
    "location": "Tana River CBD",
    "county": "Tana River",
    "price": "KES 14,500 / month",
    "amenities": [
      "High-speed Wi-Fi",
      "Gym",
      "Backup Generator",
      "Shuttle Service",
      "24/7 Security",
      "Lounge"
    ],
    "contactPhone": "+254 700 154201",
    "available": true,
    "image": "/images/housing/diverse-housing-9.jpg"
  },
  {
    "id": "h106",
    "name": "Varsity Tharaka-Nithi Dorms",
    "universityId": "uni_tharakanithi",
    "type": "hostel",
    "location": "Tharaka-Nithi CBD",
    "county": "Tharaka-Nithi",
    "price": "KES 10,500 / month",
    "amenities": [
      "Spacious Rooms",
      "Balcony",
      "Secure Compound",
      "Borehole Water"
    ],
    "contactPhone": "+254 700 757928",
    "available": true,
    "image": "/images/housing/diverse-housing-7.jpg"
  },
  {
    "id": "h107",
    "name": "Sunrise Tharaka-Nithi Suites",
    "universityId": "uni_tharakanithi",
    "type": "hostel",
    "location": "Tharaka-Nithi CBD",
    "county": "Tharaka-Nithi",
    "price": "KES 12,500 / month",
    "amenities": [
      "Gym",
      "Cafeteria",
      "Study Rooms",
      "Constant Water",
      "CCTV"
    ],
    "contactPhone": "+254 700 746682",
    "available": true,
    "image": "/images/housing/diverse-housing-18.jpg"
  },
  {
    "id": "h108",
    "name": "Pwani Trans Nzoia Courts",
    "universityId": "uni_transnzoia",
    "type": "hostel",
    "location": "Trans Nzoia CBD",
    "county": "Trans Nzoia",
    "price": "KES 7,500 / month",
    "amenities": [
      "24/7 Security",
      "Wi-Fi",
      "Constant Water",
      "Study Lounges"
    ],
    "contactPhone": "+254 700 959883",
    "available": true,
    "image": "/images/housing/diverse-housing-5.jpg"
  },
  {
    "id": "h109",
    "name": "Premier Trans Nzoia Suites",
    "universityId": "uni_transnzoia",
    "type": "hostel",
    "location": "Trans Nzoia CBD",
    "county": "Trans Nzoia",
    "price": "KES 12,500 / month",
    "amenities": [
      "24/7 Security",
      "Wi-Fi",
      "Constant Water",
      "Study Lounges"
    ],
    "contactPhone": "+254 700 840446",
    "available": true,
    "image": "/images/housing/diverse-housing-29.jpg"
  },
  {
    "id": "h110",
    "name": "Elite Trans Nzoia Lodge",
    "universityId": "uni_transnzoia",
    "type": "hostel",
    "location": "Trans Nzoia CBD",
    "county": "Trans Nzoia",
    "price": "KES 13,500 / month",
    "amenities": [
      "Wi-Fi",
      "Gym",
      "Study Rooms",
      "24/7 Security"
    ],
    "contactPhone": "+254 700 793898",
    "available": true,
    "image": "/images/housing/diverse-housing-8.jpg"
  },
  {
    "id": "h111",
    "name": "Premier Turkana Residences",
    "universityId": "uni_turkana",
    "type": "apartment",
    "location": "Turkana CBD",
    "county": "Turkana",
    "price": "KES 13,500 / month",
    "amenities": [
      "24/7 Security",
      "Wi-Fi",
      "Constant Water",
      "Study Lounges"
    ],
    "contactPhone": "+254 700 703171",
    "available": true,
    "image": "/images/housing/diverse-housing-6.jpg"
  },
  {
    "id": "h112",
    "name": "Central Turkana Apartments",
    "universityId": "uni_turkana",
    "type": "hostel",
    "location": "Turkana CBD",
    "county": "Turkana",
    "price": "KES 10,500 / month",
    "amenities": [
      "En-suite bathrooms",
      "High-speed Wi-Fi",
      "CCTV",
      "Ample Parking"
    ],
    "contactPhone": "+254 700 392801",
    "available": true,
    "image": "/images/housing/diverse-housing-29.jpg"
  },
  {
    "id": "h113",
    "name": "Valley Turkana Villas",
    "universityId": "uni_turkana",
    "type": "apartment",
    "location": "Turkana CBD",
    "county": "Turkana",
    "price": "KES 7,500 / month",
    "amenities": [
      "Wi-Fi",
      "Recreation Room",
      "Backup Generator",
      "Shuttle Service"
    ],
    "contactPhone": "+254 700 520804",
    "available": true,
    "image": "/images/housing/diverse-housing-30.jpg"
  },
  {
    "id": "h114",
    "name": "City Uasin Gishu Suites",
    "universityId": "uni_uasingishu",
    "type": "hostel",
    "location": "Uasin Gishu CBD",
    "county": "Uasin Gishu",
    "price": "KES 7,500 / month",
    "amenities": [
      "Wi-Fi",
      "Gym",
      "Study Rooms",
      "24/7 Security"
    ],
    "contactPhone": "+254 700 321848",
    "available": true,
    "image": "/images/housing/diverse-housing-16.jpg"
  },
  {
    "id": "h115",
    "name": "Varsity Uasin Gishu Courts",
    "universityId": "uni_uasingishu",
    "type": "hostel",
    "location": "Uasin Gishu CBD",
    "county": "Uasin Gishu",
    "price": "KES 5,500 / month",
    "amenities": [
      "24/7 Security",
      "Wi-Fi",
      "Constant Water",
      "Study Lounges"
    ],
    "contactPhone": "+254 700 839041",
    "available": true,
    "image": "/images/housing/diverse-housing-13.jpg"
  },
  {
    "id": "h116",
    "name": "Premier Uasin Gishu Courts",
    "universityId": "uni_uasingishu",
    "type": "hostel",
    "location": "Uasin Gishu CBD",
    "county": "Uasin Gishu",
    "price": "KES 11,500 / month",
    "amenities": [
      "24/7 Security",
      "Wi-Fi",
      "Constant Water",
      "Study Lounges"
    ],
    "contactPhone": "+254 700 444171",
    "available": true,
    "image": "/images/housing/diverse-housing-8.jpg"
  },
  {
    "id": "h117",
    "name": "Varsity Vihiga Lodge",
    "universityId": "uni_vihiga",
    "type": "apartment",
    "location": "Vihiga CBD",
    "county": "Vihiga",
    "price": "KES 6,500 / month",
    "amenities": [
      "High-speed Wi-Fi",
      "Gym",
      "Backup Generator",
      "Shuttle Service",
      "24/7 Security",
      "Lounge"
    ],
    "contactPhone": "+254 700 746157",
    "available": true,
    "image": "/images/housing/diverse-housing-4.jpg"
  },
  {
    "id": "h118",
    "name": "Sunrise Vihiga Lodge",
    "universityId": "uni_vihiga",
    "type": "hostel",
    "location": "Vihiga CBD",
    "county": "Vihiga",
    "price": "KES 9,500 / month",
    "amenities": [
      "Spacious Rooms",
      "Balcony",
      "Secure Compound",
      "Borehole Water"
    ],
    "contactPhone": "+254 700 291583",
    "available": true,
    "image": "/images/housing/diverse-housing-14.jpg"
  },
  {
    "id": "h119",
    "name": "Premier Vihiga Suites",
    "universityId": "uni_vihiga",
    "type": "apartment",
    "location": "Vihiga CBD",
    "county": "Vihiga",
    "price": "KES 6,500 / month",
    "amenities": [
      "Wi-Fi",
      "Recreation Room",
      "Backup Generator",
      "Shuttle Service"
    ],
    "contactPhone": "+254 700 219233",
    "available": true,
    "image": "/images/housing/diverse-housing-21.jpg"
  },
  {
    "id": "h120",
    "name": "Oasis Wajir Suites",
    "universityId": "uni_wajir",
    "type": "hostel",
    "location": "Wajir CBD",
    "county": "Wajir",
    "price": "KES 7,500 / month",
    "amenities": [
      "En-suite bathrooms",
      "High-speed Wi-Fi",
      "CCTV",
      "Ample Parking"
    ],
    "contactPhone": "+254 700 553077",
    "available": true,
    "image": "/images/housing/diverse-housing-21.jpg"
  },
  {
    "id": "h121",
    "name": "Elite Wajir Apartments",
    "universityId": "uni_wajir",
    "type": "hostel",
    "location": "Wajir CBD",
    "county": "Wajir",
    "price": "KES 9,500 / month",
    "amenities": [
      "Spacious Rooms",
      "Balcony",
      "Secure Compound",
      "Borehole Water"
    ],
    "contactPhone": "+254 700 526622",
    "available": true,
    "image": "/images/housing/diverse-housing-14.jpg"
  },
  {
    "id": "h122",
    "name": "Pwani Wajir Courts",
    "universityId": "uni_wajir",
    "type": "apartment",
    "location": "Wajir CBD",
    "county": "Wajir",
    "price": "KES 8,500 / month",
    "amenities": [
      "En-suite bathrooms",
      "High-speed Wi-Fi",
      "CCTV",
      "Ample Parking"
    ],
    "contactPhone": "+254 700 962340",
    "available": true,
    "image": "/images/housing/diverse-housing-7.jpg"
  },
  {
    "id": "h123",
    "name": "Central West Pokot Apartments",
    "universityId": "uni_westpokot",
    "type": "hostel",
    "location": "West Pokot CBD",
    "county": "West Pokot",
    "price": "KES 9,500 / month",
    "amenities": [
      "Wi-Fi",
      "Gym",
      "Study Rooms",
      "24/7 Security"
    ],
    "contactPhone": "+254 700 167454",
    "available": false,
    "image": "/images/housing/diverse-housing-28.jpg"
  },
  {
    "id": "h124",
    "name": "Varsity West Pokot Courts",
    "universityId": "uni_westpokot",
    "type": "apartment",
    "location": "West Pokot CBD",
    "county": "West Pokot",
    "price": "KES 7,500 / month",
    "amenities": [
      "En-suite bathrooms",
      "High-speed Wi-Fi",
      "CCTV",
      "Ample Parking"
    ],
    "contactPhone": "+254 700 541270",
    "available": true,
    "image": "/images/housing/diverse-housing-17.jpg"
  },
  {
    "id": "h125",
    "name": "Highland West Pokot Hostel",
    "universityId": "uni_westpokot",
    "type": "apartment",
    "location": "West Pokot CBD",
    "county": "West Pokot",
    "price": "KES 11,500 / month",
    "amenities": [
      "Wi-Fi",
      "Gym",
      "Study Rooms",
      "24/7 Security"
    ],
    "contactPhone": "+254 700 180026",
    "available": true,
    "image": "/images/housing/diverse-housing-9.jpg"
  },
  {
    "id": "h126",
    "name": "Lakeside Nairobi Residences",
    "universityId": "jkuat",
    "type": "apartment",
    "location": "Juja, Kiambu",
    "county": "Kiambu",
    "price": "KES 17,500 / month",
    "amenities": [
      "High-speed Wi-Fi",
      "Gym",
      "Backup Generator",
      "Shuttle Service",
      "24/7 Security",
      "Lounge"
    ],
    "contactPhone": "+254 700 656614",
    "available": true,
    "image": "/images/housing/diverse-housing-16.jpg"
  },
  {
    "id": "h127",
    "name": "Pioneer Nairobi Residences",
    "universityId": "jkuat",
    "type": "apartment",
    "location": "Juja, Kiambu",
    "county": "Kiambu",
    "price": "KES 13,500 / month",
    "amenities": [
      "Wi-Fi",
      "Recreation Room",
      "Backup Generator",
      "Shuttle Service"
    ],
    "contactPhone": "+254 700 333107",
    "available": true,
    "image": "/images/housing/diverse-housing-4.jpg"
  },
  {
    "id": "h128",
    "name": "Central Nairobi Residences",
    "universityId": "jkuat",
    "type": "apartment",
    "location": "Juja, Kiambu",
    "county": "Kiambu",
    "price": "KES 12,500 / month",
    "amenities": [
      "High-speed Wi-Fi",
      "Gym",
      "Backup Generator",
      "Shuttle Service",
      "24/7 Security",
      "Lounge"
    ],
    "contactPhone": "+254 700 997663",
    "available": true,
    "image": "/images/housing/diverse-housing-7.jpg"
  },
  {
    "id": "h129",
    "name": "Cornerstone Nairobi Residences",
    "universityId": "jkuat",
    "type": "apartment",
    "location": "Juja, Kiambu",
    "county": "Kiambu",
    "price": "KES 24,500 / month",
    "amenities": [
      "High-speed Wi-Fi",
      "Gym",
      "Backup Generator",
      "Shuttle Service",
      "24/7 Security",
      "Lounge"
    ],
    "contactPhone": "+254 700 610069",
    "available": true,
    "image": "/images/housing/diverse-housing-24.jpg"
  },
  {
    "id": "h130",
    "name": "Cornerstone Nairobi Residences",
    "universityId": "jkuat",
    "type": "apartment",
    "location": "Juja, Kiambu",
    "county": "Kiambu",
    "price": "KES 10,500 / month",
    "amenities": [
      "Wi-Fi",
      "Recreation Room",
      "Backup Generator",
      "Shuttle Service"
    ],
    "contactPhone": "+254 700 474745",
    "available": true,
    "image": "/images/housing/diverse-housing-29.jpg"
  }
];

export const metadata: Metadata = {
  title: 'Student Housing | Chuo Connect Kenya',
  description: 'Find affordable student housing and hostels near universities in Kenya. Compare rooms, amenities, and prices.',
};

const TYPE_LABELS: Record<string, string> = {
  hostel: 'Hostel', apartment: 'Apartment', bedsitter: 'Bedsitter', shared: 'Shared Room',
};

const KENYAN_COUNTIES = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado", 
  "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", 
  "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi", 
  "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya", "Taita-Taveta", "Tana River", 
  "Tharaka-Nithi", "Trans-Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
];

interface Props {
  searchParams: Promise<{
    type?: string;
    county?: string;
    availableOnly?: string;
  }>;
}

export default async function HousingPage({ searchParams }: Props) {
  const params = await searchParams;
  const type = params.type;
  const county = params.county;
  const availableOnly = params.availableOnly === 'true';

  const supabase = await createClient();
  let query = supabase.from('housing').select('*').order('createdAt', { ascending: false });

  if (type && TYPE_LABELS[type]) {
    query = query.eq('type', type);
  }
  if (county) {
    query = query.ilike('county', `%${county}%`);
  }
  if (availableOnly) {
    query = query.eq('available', true);
  }

  const { data, error } = await query;
  
  // If the table doesn't exist yet (PGRST205) or data is empty (DB not seeded), use mock data
  let housingListings = (data || []) as Housing[];
  if (error?.code === 'PGRST205' || housingListings.length === 0) {
    housingListings = MOCK_HOUSING;
    
    // Apply filters to mock data manually
    if (type) {
      housingListings = housingListings.filter(h => h.type === type);
    }
    if (county) {
      housingListings = housingListings.filter(h => h.county.toLowerCase().includes(county.toLowerCase()));
    }
    if (availableOnly) {
      housingListings = housingListings.filter(h => h.available);
    }
  }

  const isError = !!error && error.code !== '42P01' && error.code !== 'PGRST205';

  return (
    <>
      {/* Hero Section */}
      <div style={{ padding: '40px 20px 0' }}>
        <div style={{ position: 'relative', border: '2px solid var(--border-medium)', borderRadius: 20, boxShadow: 'var(--shadow-neo)', background: 'var(--bg-secondary)', padding: '48px 40px', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--navy-deep) 0.8px, transparent 0.8px)', backgroundSize: '28px 28px', opacity: 0.04, pointerEvents: 'none' }}></div>
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 14px', background: 'var(--gold-glow)', border: '2px solid var(--border-medium)', borderRadius: 8, boxShadow: 'var(--shadow-neo)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: 16 }}>
              <Home size={14} />
              Student Accommodation
            </span>
            <h1 className="text-h1" style={{ color: 'var(--text-primary)', marginBottom: 12 }}>
              Find Your Perfect Student Home
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 700, lineHeight: 1.6 }}>
              Explore verified hostels, apartments, and shared spaces near your university. Filter by amenities, distance, and price to find the ideal living situation for your campus life.
            </p>
          </div>
        </div>
      </div>

      <section className="section" style={{ background: 'var(--bg-secondary)', minHeight: '60vh' }}>
        <div className="container" style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          {/* Filters Sidebar */}
          <aside style={{ width: 280, flexShrink: 0, background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--border-light)', position: 'sticky', top: 100 }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 20 }}>Filters</h3>
            
            <form action="/housing" method="GET">
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Property Type</label>
                <select name="type" defaultValue={type || ''} className="form-input" style={{ width: '100%' }}>
                  <option value="">All Types</option>
                  <option value="hostel">Hostels</option>
                  <option value="bedsitter">Bedsitters</option>
                  <option value="apartment">Apartments</option>
                  <option value="shared">Shared Rooms</option>
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>County</label>
                <select name="county" defaultValue={county || ''} className="form-input" style={{ width: '100%' }}>
                  <option value="">All Counties</option>
                  {KENYAN_COUNTIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <input type="checkbox" name="availableOnly" value="true" defaultChecked={availableOnly} style={{ width: 16, height: 16, accentColor: 'var(--gold-primary)' }} />
                  Show Available Only
                </label>
              </div>

              <button type="submit" className="btn btn-navy" style={{ width: '100%' }}>Apply Filters</button>
              
              {(type || county || availableOnly) && (
                <Link href="/housing" className="btn btn-outline" style={{ width: '100%', marginTop: 8, textAlign: 'center', display: 'block' }}>
                  Clear All
                </Link>
              )}
            </form>
          </aside>

          {/* Listings Grid */}
          <div style={{ flex: 1 }}>
            {isError ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--danger-bg)', borderRadius: 'var(--radius-lg)' }}>
                <p style={{ color: 'var(--danger-text)' }}>Failed to load housing. Please try again later.</p>
              </div>
            ) : housingListings.length === 0 ? (
              <div style={{ padding: '80px 20px', textAlign: 'center', background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-medium)' }}>
                <Search size={32} style={{ margin: '0 auto 16px', color: 'var(--text-tertiary)' }} />
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 8 }}>No housing found</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
                {housingListings.map(h => (
                  <div key={h.id} className="card" style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
                    <div style={{ height: 160, background: 'var(--navy-light)', position: 'relative', overflow: 'hidden' }}>
                      {h.image ? (
                        <img src={h.image} alt={h.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: 'var(--text-tertiary)' }}>
                          <Home size={32} />
                        </div>
                      )}
                      <div style={{ position: 'absolute', top: 12, right: 12, padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, background: 'var(--bg-primary)', color: 'var(--text-primary)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        {TYPE_LABELS[h.type]}
                      </div>
                    </div>
                    <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{h.name}</h3>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 12 }}>
                        <MapPin size={12} /> {h.location}, {h.county}
                      </div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                        {h.amenities?.slice(0, 3).map(a => (
                          <span key={a} style={{ padding: '2px 8px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                            {a}
                          </span>
                        ))}
                        {h.amenities && h.amenities.length > 3 && (
                          <span style={{ padding: '2px 8px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                            +{h.amenities.length - 3} more
                          </span>
                        )}
                      </div>

                      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 }}>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Starting from</div>
                            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gold-primary)' }}>{h.price}</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: h.available ? '#059669' : '#DC2626', fontWeight: 500 }}>
                            {h.available ? <><CheckCircle size={12}/> Available</> : <><XCircle size={12}/> Full</>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {h.contactPhone && (
                            <a href={`tel:${h.contactPhone.replace(/\s+/g, '')}`} className="btn btn-outline" style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '6px 12px' }}>
                              <Phone size={14} /> Call
                            </a>
                          )}
                          {h.contactEmail && (
                            <a href={`mailto:${h.contactEmail}`} className="btn btn-outline" style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '6px 12px' }}>
                              <Mail size={14} /> Email
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
