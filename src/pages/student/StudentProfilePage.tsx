import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User,
  Mail,
  GraduationCap,
  Hash,
  Calendar,
  LogOut,
  ExternalLink,
  ChevronRight,
  Star,
  Trophy,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import StudentLayout from '@/components/student/StudentLayout';
import { useStudentAuth } from '@/contexts/StudentAuthContext';
import { mockAchievements, calculateStars } from '@/data/studentMockData';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function StudentProfilePage() {
  const navigate = useNavigate();
  const { student, logout } = useStudentAuth();

  const totalPoints = mockAchievements
    .filter(a => a.status === 'approved')
    .reduce((sum, a) => sum + a.points, 0);
  const stars = calculateStars(totalPoints);
  const approvedCount = mockAchievements.filter(a => a.status === 'approved').length;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/student/login');
  };

  if (!student) return null;

  return (
    <StudentLayout title="Profile">
      <div className="space-y-6 pb-24">
        {/* Profile Header */}
        <Card variant="elevated" className="animate-slide-up overflow-hidden border-0">
          <div className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />
            <div className="relative flex flex-col items-center text-center">
              <Avatar className="w-20 h-20 border-4 border-white/20 shadow-lg mb-3">
                <AvatarImage src={student.photo} />
                <AvatarFallback className="bg-white/20 text-primary-foreground text-2xl font-bold">
                  {student.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold text-primary-foreground">{student.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-white/15 text-primary-foreground border-white/20 text-xs">{student.department}</Badge>
                <Badge className="bg-white/15 text-primary-foreground border-white/20 text-xs">{student.class}</Badge>
              </div>
              <div className="flex items-center gap-1 mt-3">
                {[...Array(stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                ))}
                <span className="text-sm text-primary-foreground/70 ml-1">{totalPoints} pts</span>
              </div>
            </div>
          </div>
          {/* Mini stats */}
          <div className="grid grid-cols-3 divide-x divide-border">
            <div className="p-3 text-center">
              <p className="text-lg font-bold text-foreground">{stars}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Stars</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-lg font-bold text-foreground">{totalPoints}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Points</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-lg font-bold text-foreground">{approvedCount}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Achievements</p>
            </div>
          </div>
        </Card>

        {/* Profile Details */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground px-1 uppercase tracking-wider">Details</h3>
          
          <Card className="animate-slide-up stagger-1 border-0 shadow-sm">
            <CardContent className="p-0 divide-y divide-border">
              <ProfileItem 
                icon={<User className="w-4 h-4" />}
                label="Username"
                value={`@${student.username}`}
              />
              <ProfileItem 
                icon={<Mail className="w-4 h-4" />}
                label="Email"
                value={student.email}
              />
              <ProfileItem 
                icon={<Hash className="w-4 h-4" />}
                label="Roll Number"
                value={student.rollNumber}
              />
              <ProfileItem 
                icon={<GraduationCap className="w-4 h-4" />}
                label="Class"
                value={`${student.class} - ${student.department}`}
              />
              <ProfileItem 
                icon={<Calendar className="w-4 h-4" />}
                label="Joined"
                value={format(new Date(student.joinedAt), 'MMMM yyyy')}
              />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground px-1 uppercase tracking-wider">Quick Actions</h3>
          
          <Card 
            variant="interactive" 
            className="animate-slide-up stagger-2 border-0 shadow-sm"
            onClick={() => navigate(`/students/${student.username}`)}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                  <ExternalLink className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">View Public Profile</p>
                  <p className="text-xs text-muted-foreground">See what others see</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          size="lg"
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 rounded-2xl"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </Button>
      </div>
    </StudentLayout>
  );
}

function ProfileItem({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}
