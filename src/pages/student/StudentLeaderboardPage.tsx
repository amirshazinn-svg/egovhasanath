import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Star,
  Medal,
  TrendingUp,
  School,
  Users,
  Crown,
  Flame
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StudentLayout from '@/components/student/StudentLayout';
import { 
  mockMonthlyLeaderboard, 
  mockOverallLeaderboard,
  mockMonthlyClassLeaderboard,
  mockOverallClassLeaderboard,
  mockStudentProfiles,
  mockClasses,
  LeaderboardEntry,
  ClassLeaderboardEntry 
} from '@/data/studentMockData';
import { useStudentAuth } from '@/contexts/StudentAuthContext';

export default function StudentLeaderboardPage() {
  const navigate = useNavigate();
  const { student } = useStudentAuth();
  const [leaderboardType, setLeaderboardType] = useState<'students' | 'classes'>('students');
  const [timeFilter, setTimeFilter] = useState<'monthly' | 'overall'>('monthly');

  const studentData = timeFilter === 'monthly' ? mockMonthlyLeaderboard : mockOverallLeaderboard;
  const classData = timeFilter === 'monthly' ? mockMonthlyClassLeaderboard : mockOverallClassLeaderboard;

  const currentStudent = mockStudentProfiles.find(s => s.username === student?.username);
  const currentClass = currentStudent ? mockClasses.find(c => c.id === currentStudent.classId) : null;
  const currentClassRank = currentClass ? classData.find(c => c.classId === currentClass.id)?.rank : null;

  const top3Students = studentData.filter(e => e.rank <= 3);
  const restStudents = studentData.filter(e => e.rank > 3);
  const top3Classes = classData.filter(e => e.rank <= 3);
  const restClasses = classData.filter(e => e.rank > 3);

  return (
    <StudentLayout title="Leaderboard" showBack>
      <div className="space-y-5 pb-24">
        {/* My Stats Card */}
        {currentStudent && currentClass && (
          <Card className="border-0 overflow-hidden animate-slide-up">
            <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-primary-foreground/70">Your Points</p>
                  <p className="text-2xl font-bold text-primary-foreground">
                    {timeFilter === 'monthly' ? currentStudent.monthlyPoints : currentStudent.totalPoints} pts
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-primary-foreground/70">Class Rank</p>
                  <p className="text-xl font-bold text-primary-foreground">#{currentClassRank || '-'}</p>
                  <p className="text-xs text-primary-foreground/60">{currentClass.name}</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={leaderboardType} onValueChange={(v) => setLeaderboardType(v as 'students' | 'classes')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Students
            </TabsTrigger>
            <TabsTrigger value="classes" className="flex items-center gap-2">
              <School className="h-4 w-4" />
              Classes
            </TabsTrigger>
          </TabsList>

          {/* Time Filter */}
          <div className="flex gap-2 mt-4">
            <Button
              variant={timeFilter === 'monthly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeFilter('monthly')}
              className="flex-1"
            >
              <Flame className="w-4 h-4 mr-1.5" />
              This Month
            </Button>
            <Button
              variant={timeFilter === 'overall' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeFilter('overall')}
              className="flex-1"
            >
              <Trophy className="w-4 h-4 mr-1.5" />
              All Time
            </Button>
          </div>

          {/* Student Leaderboard */}
          <TabsContent value="students" className="mt-4 space-y-4">
            {/* Podium - Top 3 */}
            {top3Students.length >= 3 && (
              <div className="flex items-end justify-center gap-2 px-2 pt-4 pb-2">
                <PodiumCard entry={top3Students.find(e => e.rank === 2)!} position={2} isCurrentUser={top3Students.find(e => e.rank === 2)?.studentId === currentStudent?.id} />
                <PodiumCard entry={top3Students.find(e => e.rank === 1)!} position={1} isCurrentUser={top3Students.find(e => e.rank === 1)?.studentId === currentStudent?.id} />
                <PodiumCard entry={top3Students.find(e => e.rank === 3)!} position={3} isCurrentUser={top3Students.find(e => e.rank === 3)?.studentId === currentStudent?.id} />
              </div>
            )}

            {/* Rest of list */}
            <div className="space-y-2">
              {restStudents.map((entry) => (
                <StudentLeaderboardCard 
                  key={entry.studentId} 
                  entry={entry} 
                  isCurrentUser={entry.studentId === currentStudent?.id}
                />
              ))}
            </div>
          </TabsContent>

          {/* Class Leaderboard */}
          <TabsContent value="classes" className="mt-4 space-y-4">
            {top3Classes.length >= 3 && (
              <div className="flex items-end justify-center gap-2 px-2 pt-4 pb-2">
                <ClassPodiumCard entry={top3Classes.find(e => e.rank === 2)!} position={2} isCurrentClass={top3Classes.find(e => e.rank === 2)?.classId === currentStudent?.classId} />
                <ClassPodiumCard entry={top3Classes.find(e => e.rank === 1)!} position={1} isCurrentClass={top3Classes.find(e => e.rank === 1)?.classId === currentStudent?.classId} />
                <ClassPodiumCard entry={top3Classes.find(e => e.rank === 3)!} position={3} isCurrentClass={top3Classes.find(e => e.rank === 3)?.classId === currentStudent?.classId} />
              </div>
            )}
            <div className="space-y-2">
              {restClasses.map((entry) => (
                <ClassLeaderboardCard 
                  key={entry.classId} 
                  entry={entry} 
                  isCurrentClass={entry.classId === currentStudent?.classId}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Card className="bg-muted/50 border-0">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center">
              Points contribute to both your personal and class rankings.
            </p>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
}

function PodiumCard({ entry, position, isCurrentUser }: { entry: LeaderboardEntry; position: number; isCurrentUser?: boolean }) {
  const config = {
    1: { height: 'h-28', bg: 'bg-gradient-to-b from-accent/20 to-accent/5', border: 'border-accent/30', badge: 'bg-accent text-accent-foreground', icon: <Crown className="w-5 h-5" /> },
    2: { height: 'h-24', bg: 'bg-gradient-to-b from-muted to-muted/50', border: 'border-border', badge: 'bg-muted-foreground/20 text-muted-foreground', icon: <Medal className="w-4 h-4" /> },
    3: { height: 'h-20', bg: 'bg-gradient-to-b from-warning/15 to-warning/5', border: 'border-warning/20', badge: 'bg-warning/20 text-warning-foreground', icon: <Medal className="w-4 h-4" /> },
  }[position]!;

  return (
    <div className={`flex-1 flex flex-col items-center ${position === 1 ? 'order-2' : position === 2 ? 'order-1' : 'order-3'}`}>
      <div className="relative mb-2">
        {position === 1 && <Crown className="w-5 h-5 text-accent absolute -top-5 left-1/2 -translate-x-1/2" />}
        <Avatar className={`${position === 1 ? 'w-14 h-14' : 'w-11 h-11'} border-2 ${isCurrentUser ? 'border-primary' : 'border-border'}`}>
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
            {entry.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${config.badge} flex items-center justify-center text-xs font-bold`}>
          {position}
        </div>
      </div>
      <p className="text-xs font-semibold text-foreground text-center truncate w-full">{entry.name.split(' ')[0]}</p>
      <p className="text-[10px] text-muted-foreground">{entry.className}</p>
      <p className="text-xs font-bold text-primary mt-0.5">{entry.points} pts</p>
      <div className="flex items-center gap-0.5 mt-0.5">
        {[...Array(Math.min(entry.stars, 5))].map((_, i) => (
          <Star key={i} className="w-2.5 h-2.5 fill-accent text-accent" />
        ))}
      </div>
    </div>
  );
}

function ClassPodiumCard({ entry, position, isCurrentClass }: { entry: ClassLeaderboardEntry; position: number; isCurrentClass?: boolean }) {
  const config = {
    1: { badge: 'bg-accent text-accent-foreground' },
    2: { badge: 'bg-muted-foreground/20 text-muted-foreground' },
    3: { badge: 'bg-warning/20 text-warning-foreground' },
  }[position]!;

  return (
    <div className={`flex-1 flex flex-col items-center ${position === 1 ? 'order-2' : position === 2 ? 'order-1' : 'order-3'}`}>
      <div className="relative mb-2">
        {position === 1 && <Crown className="w-5 h-5 text-accent absolute -top-5 left-1/2 -translate-x-1/2" />}
        <div className={`${position === 1 ? 'w-14 h-14' : 'w-11 h-11'} rounded-full bg-primary/10 flex items-center justify-center border-2 ${isCurrentClass ? 'border-primary' : 'border-border'}`}>
          <School className={`${position === 1 ? 'w-6 h-6' : 'w-5 h-5'} text-primary`} />
        </div>
        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${config.badge} flex items-center justify-center text-xs font-bold`}>
          {position}
        </div>
      </div>
      <p className="text-xs font-semibold text-foreground text-center truncate w-full">{entry.className}</p>
      <p className="text-[10px] text-muted-foreground">{entry.studentCount} students</p>
      <p className="text-xs font-bold text-primary mt-0.5">{entry.points} pts</p>
    </div>
  );
}

function StudentLeaderboardCard({ entry, isCurrentUser }: { entry: LeaderboardEntry; isCurrentUser?: boolean }) {
  return (
    <Card className={`overflow-hidden border-0 shadow-sm ${isCurrentUser ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
      <CardContent className="p-3.5">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
            {entry.rank}
          </div>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {entry.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {entry.name} {isCurrentUser && <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">You</Badge>}
            </p>
            <p className="text-xs text-muted-foreground">{entry.className}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-sm text-primary">{entry.points}</p>
            <div className="flex items-center gap-0.5 justify-end">
              {[...Array(Math.min(entry.stars, 5))].map((_, i) => (
                <Star key={i} className="h-2.5 w-2.5 fill-accent text-accent" />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ClassLeaderboardCard({ entry, isCurrentClass }: { entry: ClassLeaderboardEntry; isCurrentClass?: boolean }) {
  return (
    <Card className={`overflow-hidden border-0 shadow-sm ${isCurrentClass ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
      <CardContent className="p-3.5">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
            {entry.rank}
          </div>
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <School className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {entry.className} {isCurrentClass && <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">Yours</Badge>}
            </p>
            <p className="text-xs text-muted-foreground">{entry.department} • {entry.studentCount} students</p>
          </div>
          <p className="font-bold text-sm text-primary">{entry.points} pts</p>
        </div>
      </CardContent>
    </Card>
  );
}
