/**
 * KUCCPS Course Weighting Formula
 * w = sqrt((4/7) * r * R)
 * where r = subject raw score, R = overall raw score
 *
 * For cluster-point calculation we map KCSE grades to points
 * and aggregate across the required subject clusters.
 */

export const GRADE_POINTS: Record<string, number> = {
  'A':  12, 'A-': 11,
  'B+': 10, 'B':   9, 'B-': 8,
  'C+':  7, 'C':   6, 'C-': 5,
  'D+':  4, 'D':   3, 'D-': 2,
  'E':   1,
};

export function gradeToPoints(grade: string): number {
  return GRADE_POINTS[grade] ?? 0;
}

export function getMeanGradeFromPoints(totalPoints: number): string {
  if (totalPoints >= 81) return 'A';
  if (totalPoints >= 74) return 'A-';
  if (totalPoints >= 67) return 'B+';
  if (totalPoints >= 60) return 'B';
  if (totalPoints >= 53) return 'B-';
  if (totalPoints >= 46) return 'C+';
  if (totalPoints >= 39) return 'C';
  if (totalPoints >= 32) return 'C-';
  if (totalPoints >= 25) return 'D+';
  if (totalPoints >= 18) return 'D';
  if (totalPoints >= 11) return 'D-';
  if (totalPoints > 0) return 'E';
  return '';
}

export function calculateMeanGrade(grades: Record<string, string>): string {
  const p = (subject: string) => gradeToPoints(grades[subject] || '');

  const compulsory = [p('Mathematics'), p('English'), p('Kiswahili')];
  
  const sciences = [p('Physics'), p('Chemistry'), p('Biology')].sort((a, b) => b - a);
  const best2Sciences = sciences.slice(0, 2);
  const remainingScience = sciences.slice(2);

  const humanities = [p('History'), p('Geography'), p('CRE')].sort((a, b) => b - a);
  const bestHumanity = humanities.slice(0, 1);
  const remainingHumanities = humanities.slice(1);

  const options = [
    ...remainingScience,
    ...remainingHumanities,
    p('Business Studies'),
    p('Agriculture'),
    p('Computer Studies')
  ].sort((a, b) => b - a);
  
  const bestOption = options.slice(0, 1);

  const selected7 = [
    ...compulsory,
    ...best2Sciences,
    ...bestHumanity,
    ...bestOption
  ];

  const filledCount = Object.values(grades).filter(g => g && g !== '').length;
  if (filledCount < 7) {
    return '';
  }

  const totalPoints = selected7.reduce((sum, val) => sum + val, 0);
  return getMeanGradeFromPoints(totalPoints);
}

/**
 * KUCCPS raw score weighting formula
 * @param subjectPoints  - Raw grade points for a single subject
 * @param overallPoints  - Candidate's overall mean grade points
 */
export function kuccpsWeight(subjectPoints: number, overallPoints: number): number {
  return Math.sqrt((4 / 7) * subjectPoints * overallPoints);
}

/**
 * Calculate a student's weighted cluster score for a given cluster group.
 * Each cluster uses a specific 4 subjects from the student's results.
 */
export function calculateClusterScore(
  grades: Record<string, string>,
  clusterSubjects: string[]
): number {
  // c = total points for the 4 cluster subjects
  let c = 0;
  for (const subject of clusterSubjects) {
    const grade = grades[subject] ?? 'E';
    c += gradeToPoints(grade);
  }

  // p = total points for the 7 best subjects
  const p_val = (subject: string) => gradeToPoints(grades[subject] || '');
  const compulsory = [p_val('Mathematics'), p_val('English'), p_val('Kiswahili')];
  
  const sciences = [p_val('Physics'), p_val('Chemistry'), p_val('Biology')].sort((a, b) => b - a);
  const best2Sciences = sciences.slice(0, 2);
  const remainingScience = sciences.slice(2);

  const humanities = [p_val('History'), p_val('Geography'), p_val('CRE')].sort((a, b) => b - a);
  const bestHumanity = humanities.slice(0, 1);
  const remainingHumanities = humanities.slice(1);

  const options = [
    ...remainingScience,
    ...remainingHumanities,
    p_val('Business Studies'),
    p_val('Agriculture'),
    p_val('Computer Studies')
  ].sort((a, b) => b - a);
  
  const bestOption = options.slice(0, 1);

  const selected7 = [
    ...compulsory,
    ...best2Sciences,
    ...bestHumanity,
    ...bestOption
  ];

  const p = selected7.reduce((sum, val) => sum + val, 0);

  if (p === 0) return 0;
  
  // W = sqrt( (c/48) * (p/84) ) * 48
  const w = Math.sqrt((c / 48) * (p / 84)) * 48;
  return parseFloat(w.toFixed(2));
}

// Subject clusters as defined by KUCCPS (matching DB schema)
export const CLUSTER_SUBJECTS: Record<string, string[]> = {
  'Cluster 1: Law & Legal Studies': ['English', 'Kiswahili', 'History', 'Mathematics'],
  'Cluster 3: Arts & Humanities': ['English', 'Kiswahili', 'History', 'Geography'],
  'Cluster 4: Business & Economics': ['Mathematics', 'English', 'Business Studies', 'Geography'],
  'Cluster 7: Engineering & Technology': ['Mathematics', 'Physics', 'Chemistry', 'English'],
  'Cluster 9: Computing & Information Technology': ['Mathematics', 'Physics', 'English', 'Biology'],
  'Cluster 13: Medicine, Nursing & Health': ['Biology', 'Chemistry', 'Mathematics', 'English'],
};
