// Mock data for Student Portal - designed to be easily replaced with API calls

export interface Transaction {
  id: string;
  date: string;
  description: string;
  type: 'credit' | 'debit';
  amount: number;
  category: string;
}

export interface Achievement {
  id: string;
  studentId: string;
  title: string;
  description: string;
  points: number;
  category: string;
  date: string;
  status: 'approved' | 'pending' | 'disapproved';
  reviewedBy?: string;
  reviewNote?: string;
}

export interface StudentAccount {
  studentId: string;
  currentBalance: number;
  totalCredits: number;
  totalDebits: number;
  lastUpdated: string;
}

export interface ClassEntity {
  id: string;
  name: string;
  department: string;
  totalPoints: number;
  monthlyPoints: number;
  studentCount: number;
}

export interface StudentProfile {
  id: string;
  username: string;
  name: string;
  photo?: string;
  department: string;
  classId: string;
  className: string;
  rollNumber: string;
  joinedAt: string;
  totalPoints: number;
  monthlyPoints: number;
  stars: number;
}

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  name: string;
  className: string;
  points: number;
  stars: number;
}

export interface ClassLeaderboardEntry {
  rank: number;
  classId: string;
  className: string;
  department: string;
  points: number;
  studentCount: number;
}

// Points to Stars conversion
export const POINTS_PER_STAR = 20;

export function calculateStars(points: number): number {
  return Math.floor(points / POINTS_PER_STAR);
}

// Mock Classes
export const mockClasses: ClassEntity[] = [
  { id: 'cls-1', name: 'Class 9A', department: 'General', totalPoints: 580, monthlyPoints: 180, studentCount: 32 },
  { id: 'cls-2', name: 'Class 9B', department: 'General', totalPoints: 620, monthlyPoints: 210, studentCount: 30 },
  { id: 'cls-3', name: 'Class 10A', department: 'General', totalPoints: 540, monthlyPoints: 145, studentCount: 28 },
  { id: 'cls-4', name: 'Class 10 Science', department: 'Science', totalPoints: 750, monthlyPoints: 280, studentCount: 35 },
  { id: 'cls-5', name: 'Class 11 Commerce', department: 'Commerce', totalPoints: 480, monthlyPoints: 120, studentCount: 25 },
  { id: 'cls-6', name: 'Class 12 Science', department: 'Science', totalPoints: 820, monthlyPoints: 250, studentCount: 30 },
  { id: 'cls-7', name: 'Class 12 Arts', department: 'Arts', totalPoints: 390, monthlyPoints: 95, studentCount: 22 },
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  { id: 't1', date: '2024-12-10', description: 'Tuition Fee - December', type: 'debit', amount: 5000, category: 'Tuition' },
  { id: 't2', date: '2024-12-08', description: 'Scholarship Credit', type: 'credit', amount: 2000, category: 'Scholarship' },
  { id: 't3', date: '2024-12-05', description: 'Lab Fee', type: 'debit', amount: 500, category: 'Lab' },
  { id: 't4', date: '2024-12-01', description: 'Library Fine', type: 'debit', amount: 50, category: 'Fine' },
  { id: 't5', date: '2024-11-28', description: 'Competition Prize', type: 'credit', amount: 1000, category: 'Prize' },
  { id: 't6', date: '2024-11-25', description: 'Tuition Fee - November', type: 'debit', amount: 5000, category: 'Tuition' },
  { id: 't7', date: '2024-11-20', description: 'Sports Equipment', type: 'debit', amount: 800, category: 'Sports' },
  { id: 't8', date: '2024-11-15', description: 'Merit Scholarship', type: 'credit', amount: 3000, category: 'Scholarship' },
];

// Mock Account
export const mockAccount: StudentAccount = {
  studentId: 'std-1',
  currentBalance: -4350,
  totalCredits: 6000,
  totalDebits: 11350,
  lastUpdated: '2024-12-10'
};

// Mock Achievements
export const mockAchievements: Achievement[] = [
  { 
    id: 'a1', 
    studentId: 'std-1', 
    title: 'Science Olympiad - Gold Medal', 
    description: 'Won first place in regional Science Olympiad competition', 
    points: 50, 
    category: 'Academic', 
    date: '2024-12-05',
    status: 'approved',
    reviewedBy: 'Mr. Johnson'
  },
  { 
    id: 'a2', 
    studentId: 'std-1', 
    title: 'Perfect Attendance - November', 
    description: 'Maintained 100% attendance for the month', 
    points: 20, 
    category: 'Attendance', 
    date: '2024-11-30',
    status: 'approved'
  },
  { 
    id: 'a3', 
    studentId: 'std-1', 
    title: 'Debate Competition Winner', 
    description: 'Won inter-school debate competition', 
    points: 40, 
    category: 'Extracurricular', 
    date: '2024-11-20',
    status: 'approved',
    reviewedBy: 'Ms. Williams'
  },
  { 
    id: 'a4', 
    studentId: 'std-1', 
    title: 'Community Service - 10 Hours', 
    description: 'Completed community service at local shelter', 
    points: 25, 
    category: 'Community', 
    date: '2024-11-15',
    status: 'pending'
  },
  { 
    id: 'a5', 
    studentId: 'std-1', 
    title: 'Sports Day Participation', 
    description: 'Participated in annual sports day events', 
    points: 15, 
    category: 'Sports', 
    date: '2024-11-10',
    status: 'approved'
  },
];

// Mock Student Profiles
export const mockStudentProfiles: StudentProfile[] = [
  {
    id: 'std-1',
    username: 'rahulsharma',
    name: 'Rahul Sharma',
    department: 'Science',
    classId: 'cls-6',
    className: 'Class 12 Science',
    rollNumber: '2024-SC-042',
    joinedAt: '2023-04-01',
    totalPoints: 150,
    monthlyPoints: 70,
    stars: 7
  },
  {
    id: 'std-2',
    username: 'priyapatel',
    name: 'Priya Patel',
    department: 'Commerce',
    classId: 'cls-5',
    className: 'Class 11 Commerce',
    rollNumber: '2024-CO-018',
    joinedAt: '2023-04-01',
    totalPoints: 180,
    monthlyPoints: 45,
    stars: 9
  },
  {
    id: 'std-3',
    username: 'amitsingh',
    name: 'Amit Singh',
    department: 'Arts',
    classId: 'cls-7',
    className: 'Class 12 Arts',
    rollNumber: '2024-AR-007',
    joinedAt: '2023-04-01',
    totalPoints: 120,
    monthlyPoints: 35,
    stars: 6
  },
  {
    id: 'std-4',
    username: 'sneharao',
    name: 'Sneha Rao',
    department: 'Science',
    classId: 'cls-4',
    className: 'Class 10 Science',
    rollNumber: '2024-SC-089',
    joinedAt: '2023-04-01',
    totalPoints: 200,
    monthlyPoints: 80,
    stars: 10
  },
  {
    id: 'std-5',
    username: 'vikramjoshi',
    name: 'Vikram Joshi',
    department: 'Commerce',
    classId: 'cls-5',
    className: 'Class 11 Commerce',
    rollNumber: '2024-CO-033',
    joinedAt: '2023-04-01',
    totalPoints: 95,
    monthlyPoints: 25,
    stars: 4
  },
];

// Student Leaderboard - Monthly (public - limited info)
export const mockMonthlyLeaderboard: LeaderboardEntry[] = [
  { rank: 1, studentId: 'std-4', name: 'Sneha Rao', className: 'Class 10 Science', points: 80, stars: 4 },
  { rank: 2, studentId: 'std-1', name: 'Rahul Sharma', className: 'Class 12 Science', points: 70, stars: 3 },
  { rank: 3, studentId: 'std-2', name: 'Priya Patel', className: 'Class 11 Commerce', points: 45, stars: 2 },
  { rank: 4, studentId: 'std-3', name: 'Amit Singh', className: 'Class 12 Arts', points: 35, stars: 1 },
  { rank: 5, studentId: 'std-5', name: 'Vikram Joshi', className: 'Class 11 Commerce', points: 25, stars: 1 },
];

// Student Leaderboard - Overall (public - limited info)
export const mockOverallLeaderboard: LeaderboardEntry[] = [
  { rank: 1, studentId: 'std-4', name: 'Sneha Rao', className: 'Class 10 Science', points: 200, stars: 10 },
  { rank: 2, studentId: 'std-2', name: 'Priya Patel', className: 'Class 11 Commerce', points: 180, stars: 9 },
  { rank: 3, studentId: 'std-1', name: 'Rahul Sharma', className: 'Class 12 Science', points: 150, stars: 7 },
  { rank: 4, studentId: 'std-3', name: 'Amit Singh', className: 'Class 12 Arts', points: 120, stars: 6 },
  { rank: 5, studentId: 'std-5', name: 'Vikram Joshi', className: 'Class 11 Commerce', points: 95, stars: 4 },
];

// Class Leaderboard - Monthly
export const mockMonthlyClassLeaderboard: ClassLeaderboardEntry[] = [
  { rank: 1, classId: 'cls-4', className: 'Class 10 Science', department: 'Science', points: 280, studentCount: 35 },
  { rank: 2, classId: 'cls-6', className: 'Class 12 Science', department: 'Science', points: 250, studentCount: 30 },
  { rank: 3, classId: 'cls-2', className: 'Class 9B', department: 'General', points: 210, studentCount: 30 },
  { rank: 4, classId: 'cls-1', className: 'Class 9A', department: 'General', points: 180, studentCount: 32 },
  { rank: 5, classId: 'cls-3', className: 'Class 10A', department: 'General', points: 145, studentCount: 28 },
  { rank: 6, classId: 'cls-5', className: 'Class 11 Commerce', department: 'Commerce', points: 120, studentCount: 25 },
  { rank: 7, classId: 'cls-7', className: 'Class 12 Arts', department: 'Arts', points: 95, studentCount: 22 },
];

// Class Leaderboard - Overall
export const mockOverallClassLeaderboard: ClassLeaderboardEntry[] = [
  { rank: 1, classId: 'cls-6', className: 'Class 12 Science', department: 'Science', points: 820, studentCount: 30 },
  { rank: 2, classId: 'cls-4', className: 'Class 10 Science', department: 'Science', points: 750, studentCount: 35 },
  { rank: 3, classId: 'cls-2', className: 'Class 9B', department: 'General', points: 620, studentCount: 30 },
  { rank: 4, classId: 'cls-1', className: 'Class 9A', department: 'General', points: 580, studentCount: 32 },
  { rank: 5, classId: 'cls-3', className: 'Class 10A', department: 'General', points: 540, studentCount: 28 },
  { rank: 6, classId: 'cls-5', className: 'Class 11 Commerce', department: 'Commerce', points: 480, studentCount: 25 },
  { rank: 7, classId: 'cls-7', className: 'Class 12 Arts', department: 'Arts', points: 390, studentCount: 22 },
];

// Achievement Categories
export const achievementCategories = [
  'Academic',
  'Extracurricular',
  'Sports',
  'Community',
  'Attendance',
  'Leadership',
  'Arts',
  'Other'
];

// Helper functions to simulate API calls
export async function getStudentProfile(username: string): Promise<StudentProfile | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockStudentProfiles.find(s => s.username === username) || null;
}

export async function getStudentTransactions(studentId: string): Promise<Transaction[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockTransactions;
}

export async function getStudentAccount(studentId: string): Promise<StudentAccount> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockAccount;
}

export async function getStudentAchievements(studentId: string): Promise<Achievement[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockAchievements.filter(a => a.studentId === studentId);
}

export async function getLeaderboard(type: 'monthly' | 'overall'): Promise<LeaderboardEntry[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return type === 'monthly' ? mockMonthlyLeaderboard : mockOverallLeaderboard;
}

export async function getClassLeaderboard(type: 'monthly' | 'overall'): Promise<ClassLeaderboardEntry[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return type === 'monthly' ? mockMonthlyClassLeaderboard : mockOverallClassLeaderboard;
}

export async function getClassById(classId: string): Promise<ClassEntity | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockClasses.find(c => c.id === classId) || null;
}

export async function addAchievement(achievement: Omit<Achievement, 'id' | 'status'>): Promise<Achievement> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newAchievement: Achievement = {
    ...achievement,
    id: `a${Date.now()}`,
    status: 'approved' // Auto-approved by default
  };
  mockAchievements.push(newAchievement);
  
  // Add points to student
  const student = mockStudentProfiles.find(s => s.id === achievement.studentId);
  if (student) {
    student.totalPoints += achievement.points;
    student.monthlyPoints += achievement.points;
    student.stars = calculateStars(student.totalPoints);
    
    // Add points to class (CLASS POINT INHERITANCE)
    const studentClass = mockClasses.find(c => c.id === student.classId);
    if (studentClass) {
      studentClass.totalPoints += achievement.points;
      studentClass.monthlyPoints += achievement.points;
    }
  }
  
  return newAchievement;
}
