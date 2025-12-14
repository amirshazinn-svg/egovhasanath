import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Star,
  Medal,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StudentLayout from '@/components/student/StudentLayout';
import { 
  mockMonthlyLeaderboard, 
  mockOverallLeaderboard,
  LeaderboardEntry 
} from '@/data/studentMockData';
import { useStudentAuth } from '@/contexts/StudentAuthContext';

type LeaderboardType = 'monthly' | 'overall';

export default function StudentLeaderboardPage() {
  const navigate = useNavigate();
  const { student } = useStudentAuth();
  const [type, setType] = useState<LeaderboardType>('monthly');

  const leaderboard = type === 'monthly' ? mockMonthlyLeaderboard : mockOverallLeaderboard;

  const rankBadgeColors = {
    1: 'bg-yellow-500 text-yellow-950',
    2: 'bg-gray-400 text-gray-950',
    3: 'bg-amber-700 text-amber-50',
  };

  return (
    <StudentLayout title="Leaderboard" showBack>
      <div className="space-y-6 pb-24">
        {/* Type Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-secondary rounded-xl">
          <Button
            variant={type === 'monthly' ? 'default' : 'ghost'}
            size="lg"
            onClick={() => setType('monthly')}
            className="rounded-lg"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            This Month
          </Button>
          <Button
            variant={type === 'overall' ? 'default' : 'ghost'}
            size="lg"
            onClick={() => setType('overall')}
            className="rounded-lg"
          >
            <Trophy className="w-4 h-4 mr-2" />
            All Time
          </Button>
        </div>

        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-4 py-6">
          {/* 2nd Place */}
          {leaderboard[1] && (
            <div 
              className="flex flex-col items-center animate-slide-up stagger-2 cursor-pointer"
              onClick={() => navigate(`/students/${leaderboard[1].name.toLowerCase().replace(/\s+/g, '')}`)}
            >
              <Avatar className="w-16 h-16 border-4 border-gray-400">
                <AvatarImage src={leaderboard[1].photo} />
                <AvatarFallback className="bg-gray-400 text-gray-950 text-lg">
                  {leaderboard[1].name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="w-8 h-8 rounded-full bg-gray-400 text-gray-950 flex items-center justify-center font-bold -mt-3">
                2
              </div>
              <p className="font-medium text-sm text-foreground mt-2 text-center">
                {leaderboard[1].name.split(' ')[0]}
              </p>
              <p className="text-xs text-muted-foreground">{leaderboard[1].points} pts</p>
            </div>
          )}

          {/* 1st Place */}
          {leaderboard[0] && (
            <div 
              className="flex flex-col items-center animate-slide-up stagger-1 cursor-pointer"
              onClick={() => navigate(`/students/${leaderboard[0].name.toLowerCase().replace(/\s+/g, '')}`)}
            >
              <div className="relative">
                <Avatar className="w-20 h-20 border-4 border-yellow-500">
                  <AvatarImage src={leaderboard[0].photo} />
                  <AvatarFallback className="bg-yellow-500 text-yellow-950 text-xl">
                    {leaderboard[0].name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Trophy className="w-6 h-6 text-yellow-500 absolute -top-2 left-1/2 -translate-x-1/2" />
              </div>
              <div className="w-8 h-8 rounded-full bg-yellow-500 text-yellow-950 flex items-center justify-center font-bold -mt-3">
                1
              </div>
              <p className="font-medium text-foreground mt-2 text-center">
                {leaderboard[0].name.split(' ')[0]}
              </p>
              <p className="text-sm text-muted-foreground">{leaderboard[0].points} pts</p>
              <div className="flex items-center gap-0.5 mt-1">
                {[...Array(Math.min(leaderboard[0].stars, 5))].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                ))}
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {leaderboard[2] && (
            <div 
              className="flex flex-col items-center animate-slide-up stagger-3 cursor-pointer"
              onClick={() => navigate(`/students/${leaderboard[2].name.toLowerCase().replace(/\s+/g, '')}`)}
            >
              <Avatar className="w-14 h-14 border-4 border-amber-700">
                <AvatarImage src={leaderboard[2].photo} />
                <AvatarFallback className="bg-amber-700 text-amber-50">
                  {leaderboard[2].name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="w-8 h-8 rounded-full bg-amber-700 text-amber-50 flex items-center justify-center font-bold -mt-3">
                3
              </div>
              <p className="font-medium text-sm text-foreground mt-2 text-center">
                {leaderboard[2].name.split(' ')[0]}
              </p>
              <p className="text-xs text-muted-foreground">{leaderboard[2].points} pts</p>
            </div>
          )}
        </div>

        {/* Full Leaderboard */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground px-1 flex items-center gap-2">
            <Medal className="w-5 h-5" />
            Rankings
          </h2>

          <div className="space-y-2">
            {leaderboard.map((entry, index) => (
              <LeaderboardCard
                key={entry.studentId}
                entry={entry}
                isCurrentUser={student?.id === entry.studentId}
                onClick={() => navigate(`/students/${entry.name.toLowerCase().replace(/\s+/g, '')}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

function LeaderboardCard({ 
  entry, 
  isCurrentUser, 
  onClick 
}: { 
  entry: LeaderboardEntry; 
  isCurrentUser: boolean;
  onClick: () => void;
}) {
  const rankColors: Record<number, string> = {
    1: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30',
    2: 'bg-gray-400/20 text-gray-600 border-gray-400/30',
    3: 'bg-amber-700/20 text-amber-700 border-amber-700/30',
  };

  return (
    <Card 
      variant={isCurrentUser ? 'elevated' : 'interactive'}
      className={`cursor-pointer ${isCurrentUser ? 'ring-2 ring-primary' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
            rankColors[entry.rank] || 'bg-secondary text-muted-foreground'
          }`}>
            {entry.rank}
          </div>
          
          <Avatar className="w-10 h-10">
            <AvatarImage src={entry.photo} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {entry.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground truncate">{entry.name}</p>
              {isCurrentUser && (
                <Badge variant="secondary">You</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{entry.class}</p>
          </div>
          
          <div className="text-right flex-shrink-0">
            <p className="font-semibold text-foreground">{entry.points}</p>
            <div className="flex items-center gap-0.5 justify-end">
              <Star className="w-3 h-3 text-accent fill-accent" />
              <span className="text-xs text-muted-foreground">{entry.stars}</span>
            </div>
          </div>
          
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}
