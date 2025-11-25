import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Camera, FileText, X, Loader2, CheckCircle2, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const categories = ['Infrastructure', 'Inventory', 'Maintenance', 'Discipline', 'Academic', 'Safety', 'Other'];
const priorities = [
  { id: 'low', label: 'Low', color: 'bg-secondary' },
  { id: 'medium', label: 'Medium', color: 'bg-warning-light' },
  { id: 'high', label: 'High', color: 'bg-destructive-light' },
];

const staff = [
  { id: '1', name: 'IT Department' },
  { id: '2', name: 'Lab Coordinator' },
  { id: '3', name: 'Maintenance Team' },
  { id: '4', name: 'Class Teacher - 9A' },
  { id: '5', name: 'Class Teacher - 9B' },
  { id: '6', name: 'Sports Department' },
];

export default function RaiseIssuePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [priority, setPriority] = useState('medium');
  const [responsiblePerson, setResponsiblePerson] = useState('');
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter issue title');
      return;
    }
    
    if (!description.trim()) {
      toast.error('Please describe the issue');
      return;
    }

    if (!category) {
      toast.error('Please select a category');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      navigate('/issues');
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center animate-scale-in">
          <div className="w-20 h-20 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Issue Raised!</h2>
          <p className="text-muted-foreground mt-2">Your issue has been submitted for review</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center h-14 px-4 max-w-lg mx-auto">
          <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold text-foreground ml-3">Raise Issue</h1>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto pb-24">
        <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Issue Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief title of the issue"
              variant="filled"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              className="w-full h-28 px-4 py-3 rounded-xl border border-transparent bg-secondary text-base resize-none transition-all duration-200 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-card"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Category *</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full h-12 px-4 rounded-xl border border-transparent bg-secondary text-left flex items-center justify-between transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-card"
              >
                <span className={category ? 'text-foreground' : 'text-muted-foreground'}>
                  {category || 'Select category'}
                </span>
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              </button>
              {showCategoryDropdown && (
                <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg animate-scale-in">
                  <CardContent className="p-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCategory(cat);
                          setShowCategoryDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          category === cat ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Responsible Person */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Responsible Person/Team</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowStaffDropdown(!showStaffDropdown)}
                className="w-full h-12 px-4 rounded-xl border border-transparent bg-secondary text-left flex items-center justify-between transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-card"
              >
                <span className={responsiblePerson ? 'text-foreground' : 'text-muted-foreground'}>
                  {staff.find(s => s.id === responsiblePerson)?.name || 'Select person/team'}
                </span>
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              </button>
              {showStaffDropdown && (
                <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg animate-scale-in max-h-48 overflow-auto">
                  <CardContent className="p-2">
                    {staff.map((person) => (
                      <button
                        key={person.id}
                        type="button"
                        onClick={() => {
                          setResponsiblePerson(person.id);
                          setShowStaffDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          responsiblePerson === person.id ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                        }`}
                      >
                        {person.name}
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Priority</label>
            <div className="flex gap-2">
              {priorities.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    priority === p.id
                      ? `${p.color} ring-2 ring-offset-2 ring-primary/30`
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Attachments</label>
            
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
              <div className="space-y-2">
                {files.map((file, index) => (
                  <Card key={index} variant="flat">
                    <CardContent className="p-3 flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm text-foreground flex-1 truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1 hover:bg-destructive-light rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-destructive" />
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
            <div className="max-w-lg mx-auto">
              <Button
                type="submit"
                variant="touch"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Issue'
                )}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
