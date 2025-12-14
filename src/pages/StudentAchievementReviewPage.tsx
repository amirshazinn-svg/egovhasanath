import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trophy, 
  Calendar,
  User,
  GraduationCap,
  MessageSquare,
  Filter
} from 'lucide-react';
import { mockAchievements, mockStudentProfiles, Achievement, calculateStars, mockClasses } from '@/data/studentMockData';
import { toast } from 'sonner';

type FilterStatus = 'all' | 'pending' | 'approved' | 'disapproved';

export default function StudentAchievementReviewPage() {
  const [filter, setFilter] = useState<FilterStatus>('pending');
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);

  const filteredAchievements = achievements.filter(a => 
    filter === 'all' || a.status === filter
  );

  const getStudentInfo = (studentId: string) => {
    return mockStudentProfiles.find(s => s.id === studentId);
  };

  const handleApprove = (achievement: Achievement) => {
    const note = reviewNotes[achievement.id] || '';
    
    // Update achievement status
    setAchievements(prev => prev.map(a => 
      a.id === achievement.id 
        ? { ...a, status: 'approved' as const, reviewedBy: 'Current Teacher', reviewNote: note }
        : a
    ));

    // Add points to student and class
    const student = mockStudentProfiles.find(s => s.id === achievement.studentId);
    if (student) {
      student.totalPoints += achievement.points;
      student.monthlyPoints += achievement.points;
      student.stars = calculateStars(student.totalPoints);
      
      const studentClass = mockClasses.find(c => c.id === student.classId);
      if (studentClass) {
        studentClass.totalPoints += achievement.points;
        studentClass.monthlyPoints += achievement.points;
      }
    }

    toast.success(`Achievement approved! +${achievement.points} points awarded.`);
    setReviewNotes(prev => ({ ...prev, [achievement.id]: '' }));
  };

  const handleDisapprove = (achievement: Achievement) => {
    const note = reviewNotes[achievement.id];
    
    if (!note?.trim()) {
      toast.error('Please provide a reason for disapproval');
      return;
    }

    setAchievements(prev => prev.map(a => 
      a.id === achievement.id 
        ? { ...a, status: 'disapproved' as const, reviewedBy: 'Current Teacher', reviewNote: note }
        : a
    ));

    toast.info('Achievement disapproved');
    setReviewNotes(prev => ({ ...prev, [achievement.id]: '' }));
  };

  const pendingCount = achievements.filter(a => a.status === 'pending').length;

  const getStatusBadge = (status: Achievement['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'disapproved':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20"><XCircle className="w-3 h-3 mr-1" /> Disapproved</Badge>;
    }
  };

  return (
    <AppLayout title="Review Achievements">
      <div className="p-4 space-y-4">
        {/* Stats Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-3xl font-bold text-primary">{pendingCount}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          {(['all', 'pending', 'approved', 'disapproved'] as FilterStatus[]).map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Achievement List */}
        <div className="space-y-4">
          {filteredAchievements.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No {filter === 'all' ? '' : filter} achievements found</p>
              </CardContent>
            </Card>
          ) : (
            filteredAchievements.map((achievement) => {
              const student = getStudentInfo(achievement.studentId);
              return (
                <Card key={achievement.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{achievement.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                      </div>
                      {getStatusBadge(achievement.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Student Info */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{student?.name || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <GraduationCap className="h-4 w-4" />
                        <span>{student?.className || 'Unknown'}</span>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{achievement.category}</Badge>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {achievement.date}
                        </span>
                      </div>
                      <span className="font-semibold text-primary">+{achievement.points} pts</span>
                    </div>

                    {/* Review Note (for already reviewed) */}
                    {achievement.reviewNote && (
                      <div className="bg-muted/50 rounded-lg p-3 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>Review by {achievement.reviewedBy}</span>
                        </div>
                        <p>{achievement.reviewNote}</p>
                      </div>
                    )}

                    {/* Action Section for Pending */}
                    {achievement.status === 'pending' && (
                      <div className="pt-2 space-y-3 border-t">
                        <Textarea
                          placeholder="Add review notes (required for disapproval)..."
                          value={reviewNotes[achievement.id] || ''}
                          onChange={(e) => setReviewNotes(prev => ({ 
                            ...prev, 
                            [achievement.id]: e.target.value 
                          }))}
                          className="min-h-[80px]"
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1 border-red-500/30 text-red-600 hover:bg-red-500/10"
                            onClick={() => handleDisapprove(achievement)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Disapprove
                          </Button>
                          <Button
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(achievement)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
}
