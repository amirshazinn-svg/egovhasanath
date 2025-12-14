import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Trophy,
  Award,
  Wallet,
  GraduationCap,
  ArrowLeft,
  Share2,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  mockStudentProfiles, 
  mockAchievements,
  mockAccount,
  StudentProfile,
  Achievement,
  POINTS_PER_STAR
} from '@/data/studentMockData';
import { toast } from 'sonner';

export default function StudentPublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const found = mockStudentProfiles.find(
        s => s.username.toLowerCase() === username?.toLowerCase()
      );
      
      if (found) {
        setProfile(found);
        // Get approved achievements only
        const studentAchievements = mockAchievements.filter(
          a => a.studentId === found.id && a.status === 'approved'
        );
        setAchievements(studentAchievements);
      }
      
      setIsLoading(false);
    };

    loadProfile();
  }, [username]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.name}'s Profile`,
          text: `Check out ${profile?.name}'s achievements!`,
          url: url,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Profile link copied!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-lg mx-auto space-y-6">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="text-center space-y-4">
            <Skeleton className="h-24 w-24 rounded-full mx-auto" />
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <GraduationCap className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="text-xl font-semibold text-foreground">Student Not Found</h1>
        <p className="text-muted-foreground mt-2">This profile doesn't exist or has been removed.</p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => navigate('/students')}
        >
          Browse Students
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        {/* Profile Header */}
        <div className="text-center animate-slide-up">
          <Avatar className="w-24 h-24 mx-auto border-4 border-primary/20">
            <AvatarImage src={profile.photo} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
              {profile.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold text-foreground mt-4">{profile.name}</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="secondary">{profile.department}</Badge>
            <Badge variant="outline">{profile.class}</Badge>
          </div>
          
          {/* Stars Display */}
          <div className="flex items-center justify-center gap-1 mt-4">
            {[...Array(profile.stars)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-accent fill-accent animate-scale-in" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{profile.stars} Stars Earned</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <Card variant="stat" className="animate-slide-up stagger-1">
            <CardContent className="p-4 text-center">
              <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground">{profile.totalPoints}</p>
              <p className="text-xs text-muted-foreground">Total Points</p>
            </CardContent>
          </Card>
          
          <Card variant="stat" className="animate-slide-up stagger-2">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-success mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground">{profile.monthlyPoints}</p>
              <p className="text-xs text-muted-foreground">This Month</p>
            </CardContent>
          </Card>
          
          <Card variant="stat" className="animate-slide-up stagger-3">
            <CardContent className="p-4 text-center">
              <Award className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground">{achievements.length}</p>
              <p className="text-xs text-muted-foreground">Achievements</p>
            </CardContent>
          </Card>
        </div>

        {/* Account Summary (Read-only) */}
        <Card variant="elevated" className="animate-slide-up stagger-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Account Summary</h3>
                <p className="text-sm text-muted-foreground">Current balance</p>
              </div>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${mockAccount.currentBalance >= 0 ? 'text-success' : 'text-destructive'}`}>
                {mockAccount.currentBalance >= 0 ? '+' : ''}₹{mockAccount.currentBalance.toLocaleString()}
              </p>
              <div className="flex items-center justify-center gap-4 mt-2 text-sm">
                <span className="text-success">+₹{mockAccount.totalCredits.toLocaleString()}</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-destructive">-₹{mockAccount.totalDebits.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground px-1 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Achievements
          </h2>

          {achievements.length > 0 ? (
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <Card key={achievement.id} variant="flat" className={`animate-slide-up stagger-${Math.min(index + 1, 5)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-foreground">{achievement.title}</p>
                          <Badge variant="success" className="flex-shrink-0">
                            +{achievement.points}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                        <Badge variant="outline" className="mt-2">
                          {achievement.category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card variant="flat">
              <CardContent className="p-8 text-center">
                <Trophy className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No achievements yet</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Student Login Link */}
        <div className="text-center pt-6">
          <Button
            variant="outline"
            onClick={() => navigate('/student/login')}
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            Student Login
          </Button>
        </div>
      </div>
    </div>
  );
}
