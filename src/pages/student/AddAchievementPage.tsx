import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Save, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import StudentLayout from '@/components/student/StudentLayout';
import { achievementCategories, addAchievement } from '@/data/studentMockData';
import { useStudentAuth } from '@/contexts/StudentAuthContext';
import { toast } from 'sonner';

const pointsOptions = [
  { value: '5', label: '5 points - Minor participation' },
  { value: '10', label: '10 points - Regular participation' },
  { value: '15', label: '15 points - Active contribution' },
  { value: '20', label: '20 points - Notable achievement' },
  { value: '25', label: '25 points - Significant contribution' },
  { value: '30', label: '30 points - Major achievement' },
  { value: '40', label: '40 points - Competition winner' },
  { value: '50', label: '50 points - Outstanding achievement' },
];

export default function AddAchievementPage() {
  const navigate = useNavigate();
  const { student } = useStudentAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    points: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    if (!formData.points) {
      toast.error('Please select points');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addAchievement({
        studentId: student?.id || '',
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        points: parseInt(formData.points),
        date: new Date().toISOString().split('T')[0],
      });
      
      toast.success('Achievement submitted for review!');
      navigate('/student/achievements');
    } catch (error) {
      toast.error('Failed to submit achievement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StudentLayout title="Add Achievement" showBack>
      <div className="space-y-6 pb-24">
        {/* Info Card */}
        <Card variant="flat" className="animate-slide-up border-info/20 bg-info/5">
          <CardContent className="p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Your achievement will be visible immediately. Teachers can review and approve 
              or disapprove it. Approved achievements earn points towards your stars!
            </p>
          </CardContent>
        </Card>

        {/* Form */}
        <Card variant="elevated" className="animate-slide-up stagger-1">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">New Achievement</CardTitle>
                <CardDescription>Share your accomplishment</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Title <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="e.g., Science Fair Winner"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  variant="filled"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Category <span className="text-destructive">*</span>
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {achievementCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Points <span className="text-destructive">*</span>
                </label>
                <Select
                  value={formData.points}
                  onValueChange={(value) => setFormData({ ...formData, points: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select points earned" />
                  </SelectTrigger>
                  <SelectContent>
                    {pointsOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea
                  placeholder="Describe your achievement in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Submit Achievement
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
}
