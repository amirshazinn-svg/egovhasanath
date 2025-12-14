import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award, 
  Plus, 
  Star,
  Trophy,
  Filter,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StudentLayout from '@/components/student/StudentLayout';
import { 
  mockAchievements, 
  Achievement,
  calculateStars,
  POINTS_PER_STAR
} from '@/data/studentMockData';
import { format } from 'date-fns';

type FilterType = 'all' | 'approved' | 'pending' | 'disapproved';

export default function StudentAchievementsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredAchievements = mockAchievements.filter(a => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  const totalPoints = mockAchievements
    .filter(a => a.status === 'approved')
    .reduce((sum, a) => sum + a.points, 0);

  const filters: { value: FilterType; label: string; icon: React.ReactNode }[] = [
    { value: 'all', label: 'All', icon: <Award className="w-4 h-4" /> },
    { value: 'approved', label: 'Approved', icon: <CheckCircle2 className="w-4 h-4" /> },
    { value: 'pending', label: 'Pending', icon: <Clock className="w-4 h-4" /> },
    { value: 'disapproved', label: 'Rejected', icon: <XCircle className="w-4 h-4" /> },
  ];

  return (
    <StudentLayout 
      title="Achievements" 
      showBack
      actions={
        <Button size="icon" variant="ghost" onClick={() => navigate('/student/achievements/new')}>
          <Plus className="w-5 h-5" />
        </Button>
      }
    >
      <div className="space-y-6 pb-24">
        {/* Summary Card */}
        <Card variant="elevated" className="animate-slide-up overflow-hidden">
          <div className="bg-gradient-to-br from-accent to-accent/80 p-6 text-accent-foreground">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-accent-foreground/80">Total Points Earned</p>
                <p className="text-4xl font-bold">{totalPoints}</p>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(calculateStars(totalPoints))].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-sm text-accent-foreground/70 mt-2">
              {POINTS_PER_STAR - (totalPoints % POINTS_PER_STAR)} more points to next star
            </p>
          </div>
        </Card>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f.value)}
              className="flex-shrink-0"
            >
              {f.icon}
              <span className="ml-1">{f.label}</span>
            </Button>
          ))}
        </div>

        {/* Add Achievement Button */}
        <Button
          size="lg" 
          className="w-full"
          onClick={() => navigate('/student/achievements/new')}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Achievement
        </Button>

        {/* Achievements List */}
        <div className="space-y-3">
          {filteredAchievements.map((achievement, index) => (
            <AchievementCard 
              key={achievement.id} 
              achievement={achievement}
              index={index}
            />
          ))}

          {filteredAchievements.length === 0 && (
            <Card variant="flat">
              <CardContent className="p-8 text-center">
                <Trophy className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No achievements found</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => navigate('/student/achievements/new')}
                >
                  Add Your First Achievement
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}

function AchievementCard({ achievement, index }: { achievement: Achievement; index: number }) {
  const statusConfig = {
    approved: { 
      icon: <CheckCircle2 className="w-4 h-4" />, 
      variant: 'success' as const,
      label: 'Approved'
    },
    pending: { 
      icon: <Clock className="w-4 h-4" />, 
      variant: 'warning' as const,
      label: 'Pending'
    },
    disapproved: { 
      icon: <XCircle className="w-4 h-4" />, 
      variant: 'destructive' as const,
      label: 'Rejected'
    },
  };

  const status = statusConfig[achievement.status];

  return (
    <Card 
      variant="interactive" 
      className={`animate-slide-up stagger-${Math.min(index + 1, 5)}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-foreground">{achievement.title}</p>
              <Badge variant={status.variant} className="flex-shrink-0 flex items-center gap-1">
                {status.icon}
                {achievement.status === 'approved' && `+${achievement.points}`}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {achievement.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{achievement.category}</Badge>
              <span className="text-xs text-muted-foreground">
                {format(new Date(achievement.date), 'MMM d, yyyy')}
              </span>
            </div>
            {achievement.reviewNote && (
              <p className="text-sm text-muted-foreground mt-2 italic">
                "{achievement.reviewNote}"
              </p>
            )}
            {achievement.reviewedBy && (
              <p className="text-xs text-muted-foreground mt-1">
                Reviewed by {achievement.reviewedBy}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
