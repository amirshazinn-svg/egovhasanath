import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Clock,
  FileText,
  RotateCcw,
  Briefcase
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Duty {
  id: string;
  name: string;
  description: string;
  category: 'responsibility' | 'rotational';
  frequency: string;
  assignedMembers: { id: string; name: string }[];
  nextTaskDue?: string;
  lastCompleted?: string;
}

const dutyData: Duty = {
  id: '1',
  name: 'Morning Assembly',
  description: 'Conduct morning assembly and announcements. Ensure all students are present and attentive. Coordinate with music teacher for national anthem. Make important announcements for the day.',
  category: 'rotational',
  frequency: 'Weekly',
  assignedMembers: [
    { id: '1', name: 'John Smith' },
    { id: '2', name: 'Jane Doe' },
    { id: '3', name: 'Mike Johnson' },
    { id: '4', name: 'Sarah Williams' },
    { id: '5', name: 'David Brown' },
  ],
  nextTaskDue: 'Tomorrow, 8:00 AM',
  lastCompleted: 'Nov 25, 2024',
};

export default function DutyDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center h-14 px-4 max-w-lg mx-auto">
          <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold text-foreground ml-3">Duty Details</h1>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto pb-32 space-y-4">
        {/* Duty Header */}
        <Card variant="elevated" className="animate-fade-in">
          <CardContent className="p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                dutyData.category === 'rotational' ? 'bg-accent-light' : 'bg-primary-light'
              }`}>
                {dutyData.category === 'rotational' ? (
                  <RotateCcw className="w-7 h-7 text-accent" />
                ) : (
                  <Briefcase className="w-7 h-7 text-primary" />
                )}
              </div>
              <div>
                <Badge variant={dutyData.category === 'rotational' ? 'accent' : 'default'}>
                  {dutyData.category}
                </Badge>
                <h2 className="text-xl font-bold text-foreground mt-1">{dutyData.name}</h2>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              {dutyData.description}
            </p>
          </CardContent>
        </Card>

        {/* Schedule Info */}
        <Card className="animate-slide-up">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-info-light flex items-center justify-center">
                <Clock className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Frequency</p>
                <p className="font-medium text-foreground">{dutyData.frequency}</p>
              </div>
            </div>
            
            {dutyData.nextTaskDue && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning-light flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-warning-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next Task Due</p>
                  <p className="font-medium text-foreground">{dutyData.nextTaskDue}</p>
                </div>
              </div>
            )}
            
            {dutyData.lastCompleted && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success-light flex items-center justify-center">
                  <FileText className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Completed</p>
                  <p className="font-medium text-foreground">{dutyData.lastCompleted}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assigned Members */}
        <div className="animate-slide-up stagger-2" style={{ animationFillMode: 'backwards' }}>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Assigned Members ({dutyData.assignedMembers.length})
          </h3>
          <Card>
            <CardContent className="p-3">
              <div className="space-y-2">
                {dutyData.assignedMembers.map((member) => (
                  <div 
                    key={member.id}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-foreground">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{member.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <div className="max-w-lg mx-auto">
          <Button
            variant="touch"
            className="w-full"
            onClick={() => navigate('/reports/new')}
          >
            <FileText className="w-5 h-5" />
            Submit Report
          </Button>
        </div>
      </div>
    </div>
  );
}
