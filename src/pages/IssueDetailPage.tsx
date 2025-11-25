import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Tag,
  MessageSquare,
  Send,
  Forward,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'resolved' | 'forwarded';
  responsiblePerson: string;
  createdAt: string;
  createdBy: string;
  timeline: {
    id: string;
    action: string;
    by: string;
    time: string;
    comment?: string;
  }[];
}

const issueData: Issue = {
  id: '1',
  title: 'Projector not working in Room 201',
  description: 'The projector has been showing blank screen since morning. Tried restarting but issue persists. Need urgent fix for today\'s presentation.',
  category: 'Infrastructure',
  priority: 'high',
  status: 'open',
  responsiblePerson: 'IT Department',
  createdAt: '2 hours ago',
  createdBy: 'John Smith',
  timeline: [
    { id: '1', action: 'Issue created', by: 'John Smith', time: '2 hours ago' },
    { id: '2', action: 'Assigned to IT Department', by: 'System', time: '2 hours ago' },
    { id: '3', action: 'Comment added', by: 'IT Support', time: '1 hour ago', comment: 'Looking into it. Will send someone shortly.' },
  ],
};

export default function IssueDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [comment, setComment] = useState('');

  const handleAddComment = () => {
    if (!comment.trim()) return;
    toast.success('Comment added');
    setComment('');
  };

  const handleResolve = () => {
    toast.success('Issue marked as resolved');
    navigate('/issues');
  };

  const handleForward = () => {
    toast.success('Issue forwarded');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center h-14 px-4 max-w-lg mx-auto">
          <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold text-foreground ml-3">Issue Details</h1>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto pb-32 space-y-4">
        {/* Issue Info */}
        <Card variant="elevated" className="animate-fade-in">
          <CardContent className="p-5">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant={issueData.status === 'open' ? 'open' : 'resolved'}>
                {issueData.status}
              </Badge>
              <Badge variant={issueData.priority}>
                {issueData.priority} priority
              </Badge>
            </div>
            <h2 className="text-lg font-bold text-foreground">{issueData.title}</h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {issueData.description}
            </p>
            
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="w-4 h-4" />
                {issueData.category}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                {issueData.responsiblePerson}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                {issueData.createdAt}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <div className="animate-slide-up">
          <h3 className="font-semibold text-foreground mb-3">Activity</h3>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                {issueData.timeline.map((item, index) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      {index < issueData.timeline.length - 1 && (
                        <div className="w-0.5 flex-1 bg-border mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium text-foreground">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.by} · {item.time}</p>
                      {item.comment && (
                        <div className="mt-2 p-3 rounded-lg bg-secondary text-sm text-secondary-foreground">
                          {item.comment}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Comment */}
        <div className="animate-slide-up stagger-2" style={{ animationFillMode: 'backwards' }}>
          <h3 className="font-semibold text-foreground mb-3">Add Comment</h3>
          <div className="flex gap-2">
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1"
            />
            <Button variant="default" size="icon" onClick={handleAddComment}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 animate-slide-up stagger-3" style={{ animationFillMode: 'backwards' }}>
          <Button variant="touch-outline" className="flex-1" onClick={handleForward}>
            <Forward className="w-5 h-5" />
            Forward
          </Button>
          <Button variant="touch" className="flex-1 bg-success hover:bg-success/90" onClick={handleResolve}>
            <CheckCircle2 className="w-5 h-5" />
            Resolve
          </Button>
        </div>
      </main>
    </div>
  );
}
