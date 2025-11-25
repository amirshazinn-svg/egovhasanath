import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Upload, 
  Camera,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Task {
  id: string;
  dutyName: string;
  title: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'pending' | 'completed' | 'missed';
  instructions: string;
}

const taskData: Task = {
  id: '1',
  dutyName: 'Morning Assembly',
  title: 'Lead morning assembly',
  scheduledDate: 'Today, Dec 2',
  scheduledTime: '8:00 AM',
  status: 'pending',
  instructions: 'Prepare announcements for the day. Ensure microphone is working. Coordinate with music teacher for national anthem. Check attendance of students during assembly.',
};

export default function TaskDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [description, setDescription] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error('Please add a description');
      return;
    }
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast.success('Report submitted successfully!');
    navigate('/tasks');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center h-14 px-4 max-w-lg mx-auto">
          <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold text-foreground ml-3">Task Details</h1>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto pb-32 space-y-4">
        {/* Task Info */}
        <Card variant="elevated" className="animate-fade-in">
          <CardContent className="p-5">
            <Badge variant="pending" className="mb-3">{taskData.status}</Badge>
            <p className="text-sm text-muted-foreground">{taskData.dutyName}</p>
            <h2 className="text-xl font-bold text-foreground mt-1">{taskData.title}</h2>
            
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {taskData.scheduledDate}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {taskData.scheduledTime}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="animate-slide-up">
          <CardContent className="p-5">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-primary" />
              Instructions
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {taskData.instructions}
            </p>
          </CardContent>
        </Card>

        {/* Submit Report Section */}
        <div className="animate-slide-up stagger-2" style={{ animationFillMode: 'backwards' }}>
          <h3 className="font-semibold text-foreground mb-3">Submit Report</h3>
          
          <div className="space-y-4">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what was accomplished..."
              className="w-full h-28 px-4 py-3 rounded-xl border border-input bg-card text-base resize-none transition-all duration-200 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            
            <div className="flex gap-2">
              <label className="flex-1">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,.pdf"
                />
                <div className="flex items-center justify-center gap-2 h-12 px-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Upload</span>
                </div>
              </label>
              <label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex items-center justify-center w-12 h-12 rounded-xl border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors">
                  <Camera className="w-5 h-5 text-muted-foreground" />
                </div>
              </label>
            </div>
            
            {files.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {files.length} file(s) selected
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <div className="max-w-lg mx-auto">
          <Button
            variant="touch"
            className="w-full"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Submit Report
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
