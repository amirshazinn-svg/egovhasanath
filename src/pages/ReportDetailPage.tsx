import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Paperclip, FileText, Image, CheckCircle2, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'document';
  url: string;
}

interface Comment {
  id: string;
  author: string;
  authorInitials: string;
  content: string;
  timestamp: string;
}

const reportData: {
  id: string;
  dutyName: string;
  teacherName: string;
  teacherInitials: string;
  teacherRole: string;
  submittedDate: string;
  submittedTime: string;
  status: 'pending' | 'reviewed';
  description: string;
  attachments: Attachment[];
  comments: Comment[];
} = {
  id: '1',
  dutyName: 'Morning Assembly',
  teacherName: 'John Smith',
  teacherInitials: 'JS',
  teacherRole: 'Senior Teacher',
  submittedDate: 'Today',
  submittedTime: '9:15 AM',
  status: 'pending',
  description: 'Assembly conducted successfully. All students were present and participated actively. The national anthem was sung, and morning prayers were conducted. Daily announcements included information about upcoming sports day and exam schedule reminders.',
  attachments: [
    { id: '1', name: 'assembly_photo.jpg', type: 'image' as const, url: '#' },
    { id: '2', name: 'attendance_sheet.pdf', type: 'document' as const, url: '#' },
  ],
  comments: [
    {
      id: '1',
      author: 'Principal Smith',
      authorInitials: 'PS',
      content: 'Great job with the assembly. Please ensure microphone is tested before next session.',
      timestamp: '10:30 AM',
    },
  ],
};

export default function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(reportData);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMarkReviewed = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setReport({ ...report, status: 'reviewed' as const });
    toast.success('Report marked as reviewed');
    setIsSubmitting(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const comment: Comment = {
      id: String(Date.now()),
      author: 'Principal',
      authorInitials: 'P',
      content: newComment,
      timestamp: 'Just now',
    };
    
    setReport({ ...report, comments: [...report.comments, comment] });
    setNewComment('');
    toast.success('Comment added');
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center h-14 px-4 max-w-lg mx-auto">
          <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold text-foreground ml-3">Report Details</h1>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto pb-8 space-y-4">
        {/* Report Header Card */}
        <Card className="animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-semibold text-primary-foreground">
                  {report.teacherInitials}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-foreground">{report.dutyName}</h2>
                <p className="text-sm text-muted-foreground">{report.teacherName}</p>
                <p className="text-xs text-muted-foreground">{report.teacherRole}</p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant={report.status === 'pending' ? 'warning' : 'success'}>
                    {report.status === 'pending' ? 'Pending Review' : 'Reviewed'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submission Info */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.05s', animationFillMode: 'backwards' }}>
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-3">Submission Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">Date:</span>
                <span className="text-foreground font-medium">{report.submittedDate}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">Time:</span>
                <span className="text-foreground font-medium">{report.submittedTime}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Content */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-3">Report Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {report.description}
            </p>
          </CardContent>
        </Card>

        {/* Attachments */}
        {report.attachments.length > 0 && (
          <Card className="animate-slide-up" style={{ animationDelay: '0.15s', animationFillMode: 'backwards' }}>
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                Attachments ({report.attachments.length})
              </h3>
              <div className="space-y-2">
                {report.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-3 p-3 bg-secondary rounded-xl"
                  >
                    {attachment.type === 'image' ? (
                      <Image className="w-5 h-5 text-primary" />
                    ) : (
                      <FileText className="w-5 h-5 text-accent" />
                    )}
                    <span className="text-sm text-foreground flex-1">{attachment.name}</span>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comments Section */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Comments ({report.comments.length})
            </h3>
            
            {report.comments.length > 0 && (
              <div className="space-y-3 mb-4">
                {report.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-accent-foreground">
                        {comment.authorInitials}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment */}
            <div className="space-y-3">
              <textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors resize-none"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleAddComment}
                disabled={!newComment.trim() || isSubmitting}
              >
                Add Comment
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {report.status === 'pending' && (
          <div className="animate-slide-up" style={{ animationDelay: '0.25s', animationFillMode: 'backwards' }}>
            <Button
              variant="touch"
              className="w-full"
              onClick={handleMarkReviewed}
              disabled={isSubmitting}
            >
              <CheckCircle2 className="w-5 h-5" />
              {isSubmitting ? 'Processing...' : 'Mark as Reviewed'}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
