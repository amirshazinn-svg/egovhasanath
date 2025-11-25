import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, ChevronRight, RotateCcw, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';

type DutyCategory = 'all' | 'responsibility' | 'rotational';

interface Duty {
  id: string;
  name: string;
  description: string;
  category: 'responsibility' | 'rotational';
  frequency: string;
  assignedCount: number;
  nextDue?: string;
}

const duties: Duty[] = [
  {
    id: '1',
    name: 'Morning Assembly',
    description: 'Conduct morning assembly and announcements',
    category: 'rotational',
    frequency: 'Weekly',
    assignedCount: 5,
    nextDue: 'Tomorrow',
  },
  {
    id: '2',
    name: 'Lab Supervision',
    description: 'Supervise science lab during practical sessions',
    category: 'responsibility',
    frequency: 'Daily',
    assignedCount: 2,
  },
  {
    id: '3',
    name: 'Library Duty',
    description: 'Manage library during break hours',
    category: 'rotational',
    frequency: 'Weekly',
    assignedCount: 4,
    nextDue: 'Wed, Dec 4',
  },
  {
    id: '4',
    name: 'Sports Coordinator',
    description: 'Coordinate sports activities and events',
    category: 'responsibility',
    frequency: 'As needed',
    assignedCount: 1,
  },
  {
    id: '5',
    name: 'Bus Duty',
    description: 'Monitor student boarding and departure',
    category: 'rotational',
    frequency: 'Daily',
    assignedCount: 6,
    nextDue: 'Today',
  },
];

const categoryTabs: { id: DutyCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'responsibility', label: 'Responsibility' },
  { id: 'rotational', label: 'Rotational' },
];

export default function DutiesPage() {
  const [activeCategory, setActiveCategory] = useState<DutyCategory>('all');
  const navigate = useNavigate();
  const { user } = useAuth();

  const filteredDuties = duties.filter(
    duty => activeCategory === 'all' || duty.category === activeCategory
  );

  const isPrincipal = user?.role === 'principal' || user?.role === 'manager';

  return (
    <AppLayout title="Duties">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-foreground">My Duties</h2>
            <p className="text-sm text-muted-foreground">{filteredDuties.length} duties assigned</p>
          </div>
          {isPrincipal && (
            <Button variant="default" size="sm" onClick={() => navigate('/duties/new')}>
              <Plus className="w-4 h-4" />
              Add
            </Button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 animate-slide-up">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeCategory === tab.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Duties List */}
        <div className="space-y-3">
          {filteredDuties.map((duty, index) => (
            <Card 
              key={duty.id}
              variant="interactive"
              onClick={() => navigate(`/duties/${duty.id}`)}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'backwards' }}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    duty.category === 'rotational' ? 'bg-accent-light' : 'bg-primary-light'
                  }`}>
                    {duty.category === 'rotational' ? (
                      <RotateCcw className={`w-6 h-6 text-accent`} />
                    ) : (
                      <Briefcase className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground">{duty.name}</h3>
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                      {duty.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant={duty.category === 'rotational' ? 'accent' : 'default'}>
                        {duty.frequency}
                      </Badge>
                      {duty.nextDue && (
                        <span className="text-xs text-muted-foreground">
                          Next: {duty.nextDue}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {isPrincipal && (
          <div className="pt-4 animate-slide-up stagger-5" style={{ animationFillMode: 'backwards' }}>
            <Button 
              variant="touch-outline" 
              className="w-full"
              onClick={() => navigate('/duties/planner')}
            >
              <RotateCcw className="w-5 h-5" />
              Weekly Duty Planner
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
