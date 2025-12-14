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

export interface StudentProfile {
  id: string;
  username: string;
  name: string;
  photo?: string;
  department: string;
  class: string;
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
  photo?: string;
  department: string;
  class: string;
  points: number;
  stars: number;
}

// Points to Stars conversion
export const POINTS_PER_STAR = 20;

export function calculateStars(points: number): number {
  return Math.floor(points / POINTS_PER_STAR);
}

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

// Mock Student Profiles (for public viewing)
export const mockStudentProfiles: StudentProfile[] = [
  {
    id: 'std-1',
    username: 'rahulsharma',
    name: 'Rahul Sharma',
    department: 'Science',
    class: '12th Grade',
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
    class: '11th Grade',
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
    class: '12th Grade',
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
    class: '10th Grade',
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
    class: '12th Grade',
    rollNumber: '2024-CO-033',
    joinedAt: '2023-04-01',
    totalPoints: 95,
    monthlyPoints: 25,
    stars: 4
  },
];

// Leaderboard - Monthly
export const mockMonthlyLeaderboard: LeaderboardEntry[] = [
  { rank: 1, studentId: 'std-4', name: 'Sneha Rao', department: 'Science', class: '10th Grade', points: 80, stars: 4 },
  { rank: 2, studentId: 'std-1', name: 'Rahul Sharma', department: 'Science', class: '12th Grade', points: 70, stars: 3 },
  { rank: 3, studentId: 'std-2', name: 'Priya Patel', department: 'Commerce', class: '11th Grade', points: 45, stars: 2 },
  { rank: 4, studentId: 'std-3', name: 'Amit Singh', department: 'Arts', class: '12th Grade', points: 35, stars: 1 },
  { rank: 5, studentId: 'std-5', name: 'Vikram Joshi', department: 'Commerce', class: '12th Grade', points: 25, stars: 1 },
];

// Leaderboard - Overall
export const mockOverallLeaderboard: LeaderboardEntry[] = [
  { rank: 1, studentId: 'std-4', name: 'Sneha Rao', department: 'Science', class: '10th Grade', points: 200, stars: 10 },
  { rank: 2, studentId: 'std-2', name: 'Priya Patel', department: 'Commerce', class: '11th Grade', points: 180, stars: 9 },
  { rank: 3, studentId: 'std-1', name: 'Rahul Sharma', department: 'Science', class: '12th Grade', points: 150, stars: 7 },
  { rank: 4, studentId: 'std-3', name: 'Amit Singh', department: 'Arts', class: '12th Grade', points: 120, stars: 6 },
  { rank: 5, studentId: 'std-5', name: 'Vikram Joshi', department: 'Commerce', class: '12th Grade', points: 95, stars: 4 },
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

export async function addAchievement(achievement: Omit<Achievement, 'id' | 'status'>): Promise<Achievement> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newAchievement: Achievement = {
    ...achievement,
    id: `a${Date.now()}`,
    status: 'pending' // Default to pending, teacher can approve/disapprove
  };
  mockAchievements.push(newAchievement);
  return newAchievement;
}
