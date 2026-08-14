/**
 * Matching Algorithm Logic
 * Based on Phase 2.5 of the Implementation Plan
 */

export interface Teacher {
  id: string;
  name: string;
  riwayatMastery: string[];
  secondaryRiwayat?: string[];
  availability: any; // Simplified schedule overlap
  expertiseLevel: number;
  languages: string[];
  maxCapacity: number;
  currentStudents: number;
  preferredStudentAge?: string;
}

export interface Student {
  id: string;
  targetRiwayah: string;
  preferredTimes: any;
  currentLevel: string;
  preferredLanguage: string;
  ageGroup: string;
}

export function matchStudentTeacher(student: Student, availableTeachers: Teacher[]) {
  const matches = [];

  for (const teacher of availableTeachers) {
    let score = 0;

    // 1. Riwayah Match (40% weight)
    if (teacher.riwayatMastery.includes(student.targetRiwayah)) {
      score += 40;
    } else if (teacher.secondaryRiwayat?.includes(student.targetRiwayah)) {
      score += 20;
    }

    // 2. Schedule Compatibility (30% weight) - Simplified overlap check
    // In a real app, this would use a complex date/time overlap utility
    const scheduleOverlap = 1.0; // Placeholder for calculation
    score += scheduleOverlap * 30;

    // 3. Level Appropriateness (20% weight)
    const levelScore = calculateLevelMatch(student.currentLevel, teacher.expertiseLevel);
    score += levelScore * 20;

    // 4. Language & Demographic (10% weight)
    if (teacher.languages.includes(student.preferredLanguage)) score += 5;
    if (teacher.preferredStudentAge === student.ageGroup) score += 5;

    // 5. Capacity Check
    if (teacher.currentStudents < teacher.maxCapacity) {
      matches.push({
        teacherId: teacher.id,
        teacherName: teacher.name,
        score: score,
      });
    }
  }

  return matches.sort((a, b) => b.score - a.score);
}

function calculateLevelMatch(studentLevel: string, teacherExpertise: number): number {
  // Logic to determine if teacher is over/under qualified
  return 1.0; // Default match
}
