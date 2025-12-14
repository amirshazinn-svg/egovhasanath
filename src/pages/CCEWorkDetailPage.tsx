import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar,
  Award,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  mockCCEWorks,
  mockCCESubmissions,
  getSubmissionsForWork,
  evaluateSubmission,
  CCESubmission
} from '@/data/academicMockData';
import { format } from 'date-fns';

const levelColors = {
  1: 'bg-primary/10 text-primary',
  2: 'bg-accent/10 text-accent',
  3: 'bg-warning/10 text-warning',
  4: 'bg-success/10 text-success'
};

export default function CCEWorkDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const work = mockCCEWorks.find(w => w.id === id);
  const [submissions, setSubmissions] = useState<CCESubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<CCESubmission | null>(null);
  const [evaluateMarks, setEvaluateMarks] = useState('');
  const [evaluateFeedback, setEvaluateFeedback] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (id) loadSubmissions();
  }, [id]);

  const loadSubmissions = async () => {
    if (!id) return;
    const data = await getSubmissionsForWork(id);
    setSubmissions(data);
  };

  const handleEvaluate = async () => {
    if (!selectedSubmission || !evaluateMarks) {
      toast.error('Please enter marks');
      return;
    }

    const marks = parseInt(evaluateMarks);
    if (marks < 0 || marks > (work?.maxMarks || 100)) {
      toast.error(`Marks must be between 0 and ${work?.maxMarks}`);
      return;
    }

    try {
      await evaluateSubmission(
        selectedSubmission.id,
        marks,
        evaluateFeedback,
        user?.name || 'Teacher'
      );
      toast.success('Submission evaluated');
      setDialogOpen(false);
      setSelectedSubmission(null);
      setEvaluateMarks('');
      setEvaluateFeedback('');
      loadSubmissions();
    } catch (error) {
      toast.error('Failed to evaluate');
    }
  };

  if (!work) {
    return (
      <AppLayout title="CCE Work" showBack>
        <div className="p-4">
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Work not found</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const stats = {
    total: submissions.length,
    evaluated: submissions.filter(s => s.status === 'evaluated').length,
    submitted: submissions.filter(s => s.status === 'submitted').length,
    pending: submissions.filter(s => s.status === 'pending').length
  };

  return (
    <AppLayout title="CCE Work Details" showBack>
      <div className="p-4 space-y-6 pb-24">
        {/* Work Info */}
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge className={levelColors[work.level as keyof typeof levelColors]}>
                Level {work.level}
              </Badge>
              <Badge variant="outline">{work.subjectName}</Badge>
              <Badge variant={work.submissionType === 'online' ? 'default' : 'secondary'}>
                {work.submissionType}
              </Badge>
            </div>
            
            <h2 className="text-xl font-bold text-foreground">{work.title}</h2>
            <p className="text-muted-foreground mt-2">{work.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Due:</span>
                <span className="text-foreground">{format(new Date(work.dueDate), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Max:</span>
                <span className="text-foreground">{work.maxMarks} marks</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Method:</span>
                <span className="text-foreground">{work.toolMethod}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Week:</span>
                <span className="text-foreground">{work.week}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card variant="stat">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-success">{stats.evaluated}</p>
              <p className="text-xs text-muted-foreground">Evaluated</p>
            </CardContent>
          </Card>
          <Card variant="stat">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-warning">{stats.submitted}</p>
              <p className="text-xs text-muted-foreground">Submitted</p>
            </CardContent>
          </Card>
          <Card variant="stat">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-muted-foreground">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
        </div>

        {/* Submissions List */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Student Submissions
          </h3>
          
          {submissions.length === 0 ? (
            <Card variant="elevated">
              <CardContent className="p-6 text-center">
                <User className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No submissions yet</p>
              </CardContent>
            </Card>
          ) : (
            submissions.map((submission) => (
              <Card key={submission.id} variant="elevated">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{submission.studentName}</p>
                      <p className="text-sm text-muted-foreground">Roll: {submission.rollNumber}</p>
                    </div>
                    <div className="text-right">
                      {submission.status === 'evaluated' ? (
                        <>
                          <Badge variant="success">
                            {submission.marksObtained}/{work.maxMarks}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            By {submission.evaluatedBy}
                          </p>
                        </>
                      ) : submission.status === 'submitted' ? (
                        <Dialog open={dialogOpen && selectedSubmission?.id === submission.id} onOpenChange={(open) => {
                          setDialogOpen(open);
                          if (!open) setSelectedSubmission(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              onClick={() => {
                                setSelectedSubmission(submission);
                                setDialogOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Evaluate
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Evaluate Submission</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <div>
                                <p className="font-medium">{submission.studentName}</p>
                                <p className="text-sm text-muted-foreground">
                                  Roll: {submission.rollNumber}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <Label>Marks (out of {work.maxMarks})</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max={work.maxMarks}
                                  value={evaluateMarks}
                                  onChange={(e) => setEvaluateMarks(e.target.value)}
                                  placeholder="Enter marks"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Feedback</Label>
                                <Textarea
                                  value={evaluateFeedback}
                                  onChange={(e) => setEvaluateFeedback(e.target.value)}
                                  placeholder="Enter feedback"
                                  rows={3}
                                />
                              </div>
                              <Button onClick={handleEvaluate} className="w-full">
                                Submit Evaluation
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </div>
                  </div>
                  {submission.feedback && (
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      "{submission.feedback}"
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
