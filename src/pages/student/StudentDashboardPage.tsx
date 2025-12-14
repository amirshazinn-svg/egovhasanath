import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Star, 
  Trophy, 
  Wallet, 
  TrendingUp,
  Plus,
  ChevronRight,
  Award,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStudentAuth } from '@/contexts/StudentAuthContext';
import StudentLayout from '@/components/student/StudentLayout';
import { 
  mockAccount, 
  mockAchievements, 
  calculateStars,
  POINTS_PER_STAR
} from '@/data/studentMockData';

export default function StudentDashboardPage() {
  const navigate = useNavigate();
  const { student } = useStudentAuth();
  const [totalPoints, setTotalPoints] = useState(0);
  const [monthlyPoints, setMonthlyPoints] = useState(0);

  useEffect(() => {
    // Calculate points from approved achievements
    const approved = mockAchievements.filter(a => a.status === 'approved');
    const total = approved.reduce((sum, a) => sum + a.points, 0);
    
    // Calculate monthly points (current month)
    const currentMonth = new Date().getMonth();
    const monthly = approved
      .filter(a => new Date(a.date).getMonth() === currentMonth)
      .reduce((sum, a) => sum + a.points, 0);
    
    setTotalPoints(total);
    setMonthlyPoints(monthly);
  }, []);

  const stars = calculateStars(totalPoints);
  const pendingAchievements = mockAchievements.filter(a => a.status === 'pending').length;

  return (
    <StudentLayout title={`Welcome, ${student?.name?.split(' ')[0] || 'Student'}!`}>
      <div className="space-y-6 pb-24">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card variant="stat" className="animate-slide-up stagger-1">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-accent" fill="currentColor" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stars}</p>
                  <p className="text-xs text-muted-foreground">Total Stars</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="stat" className="animate-slide-up stagger-2">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalPoints}</p>
                  <p className="text-xs text-muted-foreground">Total Points</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="stat" className="animate-slide-up stagger-3">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{monthlyPoints}</p>
                  <p className="text-xs text-muted-foreground">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="stat" className="animate-slide-up stagger-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mockAccount.currentBalance >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
                  <Wallet className={`w-5 h-5 ${mockAccount.currentBalance >= 0 ? 'text-success' : 'text-destructive'}`} />
                </div>
                <div>
                  <p className={`text-xl font-bold ${mockAccount.currentBalance >= 0 ? 'text-success' : 'text-destructive'}`}>
                    ₹{Math.abs(mockAccount.currentBalance).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {mockAccount.currentBalance >= 0 ? 'Credit' : 'Due'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress to Next Star */}
        <Card variant="elevated" className="animate-slide-up stagger-5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Progress to Next Star</span>
              <span className="text-sm text-muted-foreground">
                {totalPoints % POINTS_PER_STAR}/{POINTS_PER_STAR} points
              </span>
            </div>
            <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full transition-all duration-500"
                style={{ width: `${(totalPoints % POINTS_PER_STAR) / POINTS_PER_STAR * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground px-1">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              size="lg"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => navigate('/student/achievements/new')}
            >
              <Plus className="w-6 h-6" />
              <span>Add Achievement</span>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => navigate('/student/account')}
            >
              <Wallet className="w-6 h-6" />
              <span>View Account</span>
            </Button>
          </div>
        </div>

        {/* Pending Achievements */}
        {pendingAchievements > 0 && (
          <Card 
            variant="interactive" 
            className="animate-slide-up cursor-pointer"
            onClick={() => navigate('/student/achievements')}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{pendingAchievements} Pending</p>
                  <p className="text-sm text-muted-foreground">Awaiting review</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        )}

        {/* Recent Achievements */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-semibold text-foreground">Recent Achievements</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/student/achievements')}
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {mockAchievements
              .filter(a => a.status === 'approved')
              .slice(0, 3)
              .map((achievement, index) => (
                <Card 
                  key={achievement.id} 
                  variant="interactive" 
                  className={`animate-slide-up stagger-${index + 1}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-foreground truncate">{achievement.title}</p>
                          <Badge variant="success" className="flex-shrink-0">
                            +{achievement.points}pts
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{achievement.category}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* View Public Profile */}
        <Card 
          variant="interactive" 
          className="animate-slide-up cursor-pointer"
          onClick={() => navigate(`/students/${student?.username}`)}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="font-medium text-foreground">View Public Profile</p>
                <p className="text-sm text-muted-foreground">See what others see</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
}
