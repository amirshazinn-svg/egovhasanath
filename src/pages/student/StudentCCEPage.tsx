import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar,
  Award,
  FileText,
  Clock,
  CheckCircle,
  Upload,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStudentAuth } from '@/contexts/StudentAuthContext';
import StudentLayout from '@/components/student/StudentLayout';
import { 
  mockCCEWorks,
  mockCCESubmissions,
  mockSubjects,
  getSubmissionsForStudent,
  CCEWork,
  CCESubmission
} from '@/data/academicMockData';
import { format } from 'date-fns';

const levelColors = {
  1: 'bg-primary/10 text-primary',
  2: 'bg-accent/10 text-accent',
  3: 'bg-warning/10 text-warning',
  4: 'bg-success/10 text-success'
};

export default function StudentCCEPage() {
  const navigate = useNavigate();
  const { student } = useStudentAuth();
  const [submissions, setSubmissions] = useState<CCESubmission[]>([]);
  
  // For demo, showing works for Class 9A (matching mock student)
  const works = mockCCEWorks.filter(w => w.classId === 'ac-5');

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    // Using mock student ID for demo
    const data = await getSubmissionsForStudent('s9-1');
    setSubmissions(data);
  };

  const getSubmissionForWork = (workId: string) => {
    return submissions.find(s => s.workId === workId);
  };

  const pendingWorks = works.filter(w => {
    const sub = getSubmissionForWork(w.id);
    return !sub || sub.status === 'pending';
  });

  const submittedWorks = works.filter(w => {
    const sub = getSubmissionForWork(w.id);
    return sub && (sub.status === 'submitted' || sub.status === 'evaluated');
  });

  const totalMarks = submissions
    .filter(s => s.status === 'evaluated')
    .reduce((sum, s) => sum + (s.marksObtained || 0), 0);

  const totalPossible = works
    .filter(w => submissions.some(s => s.workId === w.id && s.status === 'evaluated'))
    .reduce((sum, w) => sum + w.maxMarks, 0);

  return (
    <StudentLayout title="CCE Works">
      <div className="space-y-6 pb-24">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card variant="stat">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-warning">{pendingWorks.length}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card variant="stat">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-success">{submittedWorks.length}</p>
              <p className="text-xs text-muted-foreground">Submitted</p>
            </CardContent>
          </Card>
          <Card variant="stat">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-primary">
                {totalMarks}/{totalPossible}
              </p>
              <p className="text-xs text-muted-foreground">Marks</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Works */}
        {pendingWorks.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Pending Works
            </h3>
            {pendingWorks.map((work) => (
              <WorkCard 
                key={work.id} 
                work={work} 
                submission={getSubmissionForWork(work.id)}
              />
            ))}
          </div>
        )}

        {/* Submitted/Evaluated Works */}
        {submittedWorks.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Submitted Works
            </h3>
            {submittedWorks.map((work) => (
              <WorkCard 
                key={work.id} 
                work={work} 
                submission={getSubmissionForWork(work.id)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {works.length === 0 && (
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No CCE works assigned yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </StudentLayout>
  );
}

function WorkCard({ work, submission }: { work: CCEWork; submission?: CCESubmission }) {
  const isPastDue = new Date(work.dueDate) < new Date();
  
  return (
    <Card variant="elevated">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge className={levelColors[work.level as keyof typeof levelColors]}>
                L{work.level}
              </Badge>
              <Badge variant="outline">{work.subjectName}</Badge>
              {submission?.status === 'evaluated' && (
                <Badge variant="success">
                  {submission.marksObtained}/{work.maxMarks}
                </Badge>
              )}
            </div>
            <p className="font-semibold text-foreground">{work.title}</p>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{work.description}</p>
            
            <div className="flex items-center gap-3 mt-3 text-xs">
              <span className={`flex items-center gap-1 ${isPastDue && !submission ? 'text-destructive' : 'text-muted-foreground'}`}>
                <Calendar className="w-3 h-3" />
                Due: {format(new Date(work.dueDate), 'MMM d')}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Award className="w-3 h-3" />
                {work.maxMarks} marks
              </span>
            </div>

            {submission?.feedback && (
              <div className="mt-3 p-2 bg-success/5 rounded-lg border border-success/20">
                <p className="text-xs text-muted-foreground">Teacher Feedback:</p>
                <p className="text-sm text-foreground italic">"{submission.feedback}"</p>
              </div>
            )}
          </div>
          
          <div className="flex-shrink-0">
            {!submission || submission.status === 'pending' ? (
              work.submissionType === 'online' ? (
                <Button size="sm" variant="outline">
                  <Upload className="w-4 h-4 mr-1" />
                  Upload
                </Button>
              ) : (
                <Badge variant="secondary">Offline</Badge>
              )
            ) : submission.status === 'submitted' ? (
              <Badge variant="warning">
                <Clock className="w-3 h-3 mr-1" />
                Pending
              </Badge>
            ) : (
              <Badge variant="success">
                <CheckCircle className="w-3 h-3 mr-1" />
                Graded
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
