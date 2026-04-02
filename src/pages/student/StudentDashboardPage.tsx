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
  Calendar,
  Sparkles
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
    const approved = mockAchievements.filter(a => a.status === 'approved');
    const total = approved.reduce((sum, a) => sum + a.points, 0);
    const currentMonth = new Date().getMonth();
    const monthly = approved
      .filter(a => new Date(a.date).getMonth() === currentMonth)
      .reduce((sum, a) => sum + a.points, 0);
    setTotalPoints(total);
    setMonthlyPoints(monthly);
  }, []);

  const stars = calculateStars(totalPoints);
  const pendingAchievements = mockAchievements.filter(a => a.status === 'pending').length;
  const progressPercent = (totalPoints % POINTS_PER_STAR) / POINTS_PER_STAR * 100;

  return (
    <StudentLayout title={`Welcome, ${student?.name?.split(' ')[0] || 'Student'}!`}>
      <div className="space-y-6 pb-24">
        {/* Hero Profile Card */}
        <Card variant="elevated" className="animate-slide-up overflow-hidden border-0">
          <div className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative flex items-center gap-4">
              <Avatar className="w-16 h-16 border-3 border-white/30 shadow-lg">
                <AvatarImage src={student?.photo} />
                <AvatarFallback className="bg-white/20 text-primary-foreground text-xl font-bold">
                  {student?.name?.charAt(0) || 'S'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-primary-foreground">{student?.name}</h2>
                <p className="text-sm text-primary-foreground/70">{student?.department} • {student?.class}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  {[...Array(stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                  ))}
                  {stars === 0 && <span className="text-xs text-primary-foreground/60">No stars yet</span>}
                </div>
              </div>
            </div>
            {/* Progress bar */}
            <div className="relative mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-primary-foreground/70">Next Star Progress</span>
                <span className="text-xs font-medium text-primary-foreground/90">
                  {totalPoints % POINTS_PER_STAR}/{POINTS_PER_STAR}
                </span>
              </div>
              <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid - 2x2 */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<Star className="w-5 h-5" />}
            iconBg="bg-accent/15"
            iconColor="text-accent"
            value={stars.toString()}
            label="Total Stars"
            delay="stagger-1"
          />
          <StatCard
            icon={<Trophy className="w-5 h-5" />}
            iconBg="bg-primary/10"
            iconColor="text-primary"
            value={totalPoints.toString()}
            label="Total Points"
            delay="stagger-2"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            iconBg="bg-success/10"
            iconColor="text-success"
            value={monthlyPoints.toString()}
            label="This Month"
            delay="stagger-3"
          />
          <StatCard
            icon={<Wallet className="w-5 h-5" />}
            iconBg={mockAccount.currentBalance >= 0 ? 'bg-success/10' : 'bg-destructive/10'}
            iconColor={mockAccount.currentBalance >= 0 ? 'text-success' : 'text-destructive'}
            value={`₹${Math.abs(mockAccount.currentBalance).toLocaleString()}`}
            label={mockAccount.currentBalance >= 0 ? 'Credit' : 'Due'}
            valueColor={mockAccount.currentBalance >= 0 ? 'text-success' : 'text-destructive'}
            delay="stagger-4"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            size="lg"
            className="h-auto py-4 flex-col gap-2 rounded-2xl border-dashed border-2 hover:border-primary hover:bg-primary/5"
            onClick={() => navigate('/student/achievements/new')}
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium">Add Achievement</span>
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="h-auto py-4 flex-col gap-2 rounded-2xl border-dashed border-2 hover:border-primary hover:bg-primary/5"
            onClick={() => navigate('/student/account')}
          >
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-accent" />
            </div>
            <span className="text-sm font-medium">View Account</span>
          </Button>
        </div>

        {/* Pending Achievements */}
        {pendingAchievements > 0 && (
          <Card 
            variant="interactive" 
            className="animate-slide-up border-warning/30 bg-warning-light"
            onClick={() => navigate('/student/achievements')}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-warning/15 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{pendingAchievements} Pending Review</p>
                  <p className="text-sm text-muted-foreground">Awaiting teacher approval</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        )}

        {/* Recent Achievements */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Recent Achievements
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-primary"
              onClick={() => navigate('/student/achievements')}
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-2.5">
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
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">{achievement.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{achievement.category}</p>
                      </div>
                      <Badge className="bg-success/10 text-success border-success/20 font-semibold">
                        +{achievement.points}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

function StatCard({ 
  icon, iconBg, iconColor, value, label, delay, valueColor 
}: { 
  icon: React.ReactNode; 
  iconBg: string; 
  iconColor: string; 
  value: string; 
  label: string; 
  delay: string;
  valueColor?: string;
}) {
  return (
    <Card variant="stat" className={`animate-slide-up ${delay} border-0 shadow-sm`}>
      <CardContent className="p-4">
        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center mb-3`}>
          <span className={iconColor}>{icon}</span>
        </div>
        <p className={`text-2xl font-bold ${valueColor || 'text-foreground'}`}>{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </CardContent>
    </Card>
  );
}
