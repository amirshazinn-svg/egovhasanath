import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const teachers = [
  { id: '1', name: 'John Smith', initials: 'JS' },
  { id: '2', name: 'Jane Doe', initials: 'JD' },
  { id: '3', name: 'Mike Johnson', initials: 'MJ' },
  { id: '4', name: 'Sarah Williams', initials: 'SW' },
  { id: '5', name: 'David Brown', initials: 'DB' },
  { id: '6', name: 'Emily Davis', initials: 'ED' },
];

const duties = [
  { id: '1', name: 'Morning Assembly' },
  { id: '2', name: 'Lab Supervision' },
  { id: '3', name: 'Library Duty' },
  { id: '4', name: 'Sports Coordinator' },
  { id: '5', name: 'Bus Duty' },
];

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    teacherId: '',
    dutyId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }
    if (!formData.dueDate) {
      toast.error('Please select a due date');
      return;
    }
    if (!formData.teacherId) {
      toast.error('Please select a teacher');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const selectedTeacher = teachers.find(t => t.id === formData.teacherId);
    toast.success(`Task assigned to ${selectedTeacher?.name}`);
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
          <h1 className="font-semibold text-foreground ml-3">Create Task</h1>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto pb-8">
        <Card className="animate-fade-in">
          <CardContent className="p-6 space-y-6">
            {/* Task Title */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Task Title <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Enter task title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Description (Optional)
              </label>
              <textarea
                placeholder="Enter task description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Due Date <span className="text-destructive">*</span>
              </label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            {/* Select Teacher */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Assign to Teacher <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.teacherId}
                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                className="w-full h-12 px-4 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none transition-colors"
              >
                <option value="">Select a teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                ))}
              </select>
            </div>

            {/* Select Duty (Optional) */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Related Duty (Optional)
              </label>
              <select
                value={formData.dutyId}
                onChange={(e) => setFormData({ ...formData, dutyId: e.target.value })}
                className="w-full h-12 px-4 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none transition-colors"
              >
                <option value="">Select a duty</option>
                {duties.map((duty) => (
                  <option key={duty.id} value={duty.id}>{duty.name}</option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <Button 
              variant="touch" 
              className="w-full"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
