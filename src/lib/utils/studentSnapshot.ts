/**
 * Remembers the student's most recent calculator result in this browser only,
 * so the admission-enquiry form can pre-fill it. Holds grades and scores only;
 * no name, phone or email is ever written here.
 */

const STORAGE_KEY = 'chuo_student_snapshot_v1';

export interface StudentSnapshot {
  meanGrade: string;
  aggregatePoints: number;
  bestClusterScore: number;
  hefBand: 1 | 2 | 3 | 4 | 5;
  updatedAt: string;
}

export function saveStudentSnapshot(snapshot: StudentSnapshot): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Storage may be unavailable (private mode / quota); pre-fill is a nicety only.
  }
}

export function loadStudentSnapshot(): StudentSnapshot | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const p = parsed as Record<string, unknown>;
    if (
      typeof p.meanGrade === 'string' &&
      typeof p.aggregatePoints === 'number' &&
      typeof p.bestClusterScore === 'number' &&
      typeof p.hefBand === 'number' &&
      p.hefBand >= 1 &&
      p.hefBand <= 5 &&
      typeof p.updatedAt === 'string'
    ) {
      return p as unknown as StudentSnapshot;
    }
    return null;
  } catch {
    return null;
  }
}
