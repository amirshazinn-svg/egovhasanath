import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type DutyType = 'responsibility' | 'rotational';
type Frequency = 'none' | 'daily' | 'weekly' | 'monthly';

export default function CreateDutyPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'responsibility' as DutyType,
    frequency: 'none' as Frequency,
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const typeOptions: { value: DutyType; label: string }[] = [
    { value: 'responsibility', label: 'Responsibility' },
    { value: 'rotational', label: 'Rotational' },
  ];

  const frequencyOptions: { value: Frequency; label: string }[] = [
    { value: 'none', label: 'None' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a duty name');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast.success('Duty created successfully');
    navigate('/duties');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center h-14 px-4 max-w-lg mx-auto">
          <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold text-foreground ml-3">Create Duty</h1>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto pb-8">
        <Card className="animate-fade-in">
          <CardContent className="p-6 space-y-6">
            {/* Duty Name */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Duty Name <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Enter duty name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Duty Type */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Type <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-2">
                {typeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, type: option.value })}
                    className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      formData.type === option.value
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Frequency <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {frequencyOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, frequency: option.value })}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      formData.frequency === option.value
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Description (Optional)
              </label>
              <textarea
                placeholder="Enter duty description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button 
              variant="touch" 
              className="w-full"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Duty'}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
