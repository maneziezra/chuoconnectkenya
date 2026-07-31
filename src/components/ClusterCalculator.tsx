"use client";

import React, { useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { MATCHING_COURSES } from '@/lib/data/cutoffs';

const GRADES = [
  { label: 'Select Grade', value: 0 },
  { label: 'A', value: 12 },
  { label: 'A-', value: 11 },
  { label: 'B+', value: 10 },
  { label: 'B', value: 9 },
  { label: 'B-', value: 8 },
  { label: 'C+', value: 7 },
  { label: 'C', value: 6 },
  { label: 'C-', value: 5 },
  { label: 'D+', value: 4 },
  { label: 'D', value: 3 },
  { label: 'D-', value: 2 },
  { label: 'E', value: 1 }
];

const GRADE_LETTERS: Record<number, string> = {
  12: 'A', 11: 'A-', 10: 'B+', 9: 'B', 8: 'B-', 7: 'C+',
  6: 'C', 5: 'C-', 4: 'D+', 3: 'D', 2: 'D-', 1: 'E', 0: 'E'
};

const SUBJECTS = [
  { id: 'math', label: 'MATHEMATICS' },
  { id: 'eng', label: 'ENGLISH' },
  { id: 'kisw', label: 'KISWAHILI' },
  { id: 'chem', label: 'CHEMISTRY' },
  { id: 'phy', label: 'PHYSICS' },
  { id: 'bio', label: 'BIOLOGY' },
  { id: 'hum', label: 'HISTORY / GEO / CRE' },
  { id: 'tech', label: 'COMP / BUS / AGRI' }
];

interface FormState {
  [key: string]: number;
}

export default function ClusterCalculator() {
  const [grades, setGrades] = useState<FormState>({});
  const [results, setResults] = useState<{ score: number; mean: string; matches: typeof MATCHING_COURSES } | null>(null);

  const handleSelect = (subject: string, value: number) => {
    setGrades(prev => ({ ...prev, [subject]: value }));
  };

  const calculatePoints = () => {
    // Ensure all 8 subjects are filled
    const allFilled = SUBJECTS.every(s => (grades[s.id] || 0) > 0);
    if (!allFilled) {
      alert("Please select grades for all 8 subjects.");
      return;
    }

    // 1. Calculate Aggregate (out of 84)
    const math = grades['math'];
    const eng = grades['eng'];
    const kisw = grades['kisw'];
    const hum = grades['hum'];
    const tech = grades['tech'];
    
    // Sort sciences to get best 2 and 3rd remaining
    const sciences = [grades['chem'], grades['phy'], grades['bio']].sort((a, b) => b - a);
    const best2Sciences = sciences.slice(0, 2);
    const remainingScience = sciences[2];
    
    // Best of remaining pool for the 7th subject
    const bestRemaining = Math.max(remainingScience, tech);

    // Total Aggregate (a) out of 84
    const aggregate = math + eng + kisw + best2Sciences[0] + best2Sciences[1] + hum + bestRemaining;

    // 2. Calculate Maximum Raw Cluster Points (r) out of 48
    // We assume the most favorable cluster where they pick their top 4 subjects overall
    const allGrades = Object.values(grades).sort((a, b) => b - a);
    const r = allGrades.slice(0, 4).reduce((acc, val) => acc + val, 0);

    // 3. Calculate Estimated WCP
    // Formula: sqrt(r/48 * a/84) * 48
    const wcp = Math.sqrt((r / 48) * (aggregate / 84)) * 48;

    // 4. Mean Grade
    const meanPoints = Math.round(aggregate / 7);
    const meanGrade = GRADE_LETTERS[meanPoints] || 'E';

    // 5. Matches
    const matches = MATCHING_COURSES.filter(c => wcp >= c.cutoff)
      .sort((a, b) => b.cutoff - a.cutoff);

    setResults({
      score: wcp,
      mean: meanGrade,
      matches
    });
  };

  return (
    <div style={{ 
      background: 'var(--navy-deep)', 
      minHeight: '100vh', 
      padding: '60px 20px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '50px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white', marginBottom: '16px', fontFamily: 'Playfair Display, serif' }}>
            Cluster Points Calculator
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.7)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Select your grades for all 8 subjects to accurately estimate your KUCCPS cluster points and discover university programmes you qualify for.
          </p>
        </div>

        {/* 8-Subject Grid exactly like the screenshot */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '24px',
          marginBottom: '50px'
        }}>
          {SUBJECTS.map(subject => (
            <div key={subject.id}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '10px', letterSpacing: '0.05em' }}>
                {subject.label}
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={grades[subject.id] || 0}
                  onChange={(e) => handleSelect(subject.id, Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    appearance: 'none',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    color: 'white',
                    fontWeight: 500,
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'border-color 0.2s, background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--gold-primary)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                >
                  {GRADES.map(g => (
                    <option key={g.label} value={g.value} style={{ color: 'var(--navy-deep)' }}>
                      {g.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={20} color="rgba(255, 255, 255, 0.5)" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <button 
            onClick={calculatePoints}
            style={{
              background: 'var(--gold-primary)',
              color: 'var(--navy-deep)',
              border: 'none',
              padding: '16px 48px',
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            CALCULATE POINTS
          </button>
        </div>

        {/* Results matching the "pasted text rules" */}
        {results && (
          <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              borderRadius: 'var(--radius-lg)', 
              padding: '40px',
              textAlign: 'center',
              marginBottom: '40px'
            }}>
              <h3 style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                Your Estimated Cluster Score
              </h3>
              <div style={{ fontSize: '4.5rem', fontWeight: 700, color: 'var(--gold-primary)', fontFamily: 'Playfair Display, serif', lineHeight: 1, marginBottom: '16px' }}>
                {results.score.toFixed(1)} <span style={{ fontSize: '1.5rem', color: 'rgba(255, 255, 255, 0.3)' }}>/ 48</span>
              </div>
              <div style={{ fontSize: '1.2rem', color: 'white', fontWeight: 500 }}>
                Mean Grade: <span style={{ color: 'var(--gold-primary)', fontWeight: 700 }}>{results.mean}</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '16px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'white', margin: 0 }}>
                  Matching Courses
                </h3>
                <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                  {results.matches.length} courses
                </span>
              </div>

              {results.matches.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {results.matches.map((course, idx) => (
                    <div key={idx} style={{ 
                      background: 'rgba(255, 255, 255, 0.02)', 
                      border: '1px solid rgba(255, 255, 255, 0.08)', 
                      borderRadius: '4px', 
                      padding: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      transition: 'border-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
                    >
                      <div style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '4px', 
                        background: 'rgba(199, 155, 55, 0.05)', 
                        border: '1px solid rgba(199, 155, 55, 0.2)',
                        color: 'var(--gold-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1rem',
                        flexShrink: 0
                      }}>
                        {course.abbr}
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', margin: '0 0 4px 0' }}>
                          {course.name}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                            {course.uni}
                          </span>
                          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
                          <a 
                            href={`/universities/${course.uniId}`}
                            style={{ 
                              fontSize: '0.85rem', 
                              color: 'var(--gold-primary)', 
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontWeight: 500
                            }}
                          >
                            View University <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', borderLeft: '1px solid rgba(255, 255, 255, 0.1)', paddingLeft: '24px' }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#4ade80', fontFamily: 'Playfair Display, serif', lineHeight: 1 }}>
                          {course.cutoff.toFixed(1)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '6px' }}>
                          Cut-off
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '1.1rem' }}>No matching courses found for this score based on 2024 cut-offs.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
