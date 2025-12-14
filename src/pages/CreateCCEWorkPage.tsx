import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar,
  Award,
  FileText,
  Layers
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  mockSubjects,
  cceToolMethods,
  createCCEWork
} from '@/data/academicMockData';
import { format, addDays } from 'date-fns';

export default function CreateCCEWorkPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    subjectId: '',
    level: '',
    week: '',
    title: '',
    description: '',
    toolMethod: '',
    issuedDate: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    maxMarks: '',
    submissionType: 'offline' as 'online' | 'offline'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedSubject = mockSubjects.find(s => s.id === formData.subjectId);

  const handleSubmit = async () => {
    if (!formData.subjectId || !formData.level || !formData.title || !formData.maxMarks) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await createCCEWork({
        subjectId: formData.subjectId,
        subjectName: selectedSubject?.name || '',
        classId: selectedSubject?.classId || '',
        className: selectedSubject?.className || '',
        level: parseInt(formData.level) as 1 | 2 | 3 | 4,
        week: parseInt(formData.week) || 1,
        title: formData.title,
        description: formData.description,
        toolMethod: formData.toolMethod,
        issuedDate: formData.issuedDate,
        dueDate: formData.dueDate,
        maxMarks: parseInt(formData.maxMarks),
        submissionType: formData.submissionType,
        createdBy: user?.name || 'Teacher'
      });
      toast.success('CCE Work created successfully');
      navigate('/cce/works');
    } catch (error) {
      toast.error('Failed to create CCE Work');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout title="Create CCE Work" showBack>
      <div className="p-4 space-y-6 pb-24">
        {/* Subject Selection */}
        <div className="space-y-2">
          <Label>Subject *</Label>
          <Select 
            value={formData.subjectId} 
            onValueChange={(v) => setFormData({ ...formData, subjectId: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {mockSubjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name} - {subject.className}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Level & Week */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Level *</Label>
            <Select 
              value={formData.level} 
              onValueChange={(v) => setFormData({ ...formData, level: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Level 1</SelectItem>
                <SelectItem value="2">Level 2</SelectItem>
                <SelectItem value="3">Level 3</SelectItem>
                <SelectItem value="4">Level 4</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Week</Label>
            <Input
              type="number"
              min="1"
              max="52"
              value={formData.week}
              onChange={(e) => setFormData({ ...formData, week: e.target.value })}
              placeholder="Week number"
            />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label>Title *</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter work title"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter work description and instructions"
            rows={3}
          />
        </div>

        {/* Tool/Method */}
        <div className="space-y-2">
          <Label>Tool / Method</Label>
          <Select 
            value={formData.toolMethod} 
            onValueChange={(v) => setFormData({ ...formData, toolMethod: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              {cceToolMethods.map((method) => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Issue Date</Label>
            <Input
              type="date"
              value={formData.issuedDate}
              onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
        </div>

        {/* Max Marks */}
        <div className="space-y-2">
          <Label>Maximum Marks *</Label>
          <Input
            type="number"
            min="1"
            max="100"
            value={formData.maxMarks}
            onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
            placeholder="Enter max marks"
          />
        </div>

        {/* Submission Type */}
        <div className="space-y-2">
          <Label>Submission Type</Label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={formData.submissionType === 'offline' ? 'default' : 'outline'}
              className="h-14"
              onClick={() => setFormData({ ...formData, submissionType: 'offline' })}
            >
              <FileText className="w-5 h-5 mr-2" />
              Offline
            </Button>
            <Button
              variant={formData.submissionType === 'online' ? 'default' : 'outline'}
              className="h-14"
              onClick={() => setFormData({ ...formData, submissionType: 'online' })}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Online
            </Button>
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          variant="touch" 
          className="w-full"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create CCE Work'}
        </Button>
      </div>
    </AppLayout>
  );
}
