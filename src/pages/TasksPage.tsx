import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle2, AlertCircle, ChevronRight, Plus, Users, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';

type TaskFilter = 'today' | 'upcoming' | 'missed';
type ViewMode = 'mine' | 'all';

interface Task {
  id: string;
  dutyName: string;
  title: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'pending' | 'completed' | 'missed';
  instructions?: string;
  assignedTo?: string;
}

const tasks: Task[] = [
  {
    id: '1',
    dutyName: 'Morning Assembly',
    title: 'Lead morning assembly',
    scheduledDate: 'Today',
    scheduledTime: '8:00 AM',
    status: 'pending',
    instructions: 'Prepare announcements for the day',
    assignedTo: 'John Smith',
  },
  {
    id: '2',
    dutyName: 'Lab Supervision',
    title: 'Science lab practical',
    scheduledDate: 'Today',
    scheduledTime: '10:30 AM',
    status: 'pending',
    instructions: 'Supervise Class 10 chemistry practical',
    assignedTo: 'Jane Doe',
  },
  {
    id: '3',
    dutyName: 'Bus Duty',
    title: 'Evening bus departure',
    scheduledDate: 'Today',
    scheduledTime: '3:30 PM',
    status: 'pending',
    assignedTo: 'Principal',
  },
  {
    id: '4',
    dutyName: 'Library Duty',
    title: 'Library supervision',
    scheduledDate: 'Tomorrow',
    scheduledTime: '12:00 PM',
    status: 'pending',
    assignedTo: 'Mike Johnson',
  },
  {
    id: '5',
    dutyName: 'Staff Meeting',
    title: 'Prepare meeting notes',
    scheduledDate: 'Dec 5',
    scheduledTime: '2:00 PM',
    status: 'pending',
    assignedTo: 'Principal',
  },
  {
    id: '6',
    dutyName: 'Morning Assembly',
    title: 'Lead morning assembly',
    scheduledDate: 'Yesterday',
    scheduledTime: '8:00 AM',
    status: 'missed',
    assignedTo: 'Sarah Williams',
  },
];

const filterTabs: { id: TaskFilter; label: string; count: number }[] = [
  { id: 'today', label: 'Today', count: 3 },
  { id: 'upcoming', label: 'Upcoming', count: 2 },
  { id: 'missed', label: 'Missed', count: 1 },
];

export default function TasksPage() {
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('today');
  const [viewMode, setViewMode] = useState<ViewMode>('mine');
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPrincipal = user?.role === 'principal' || user?.role === 'manager';

  const filteredTasks = tasks.filter(task => {
    const dateMatch = activeFilter === 'today' 
      ? task.scheduledDate === 'Today'
      : activeFilter === 'upcoming' 
        ? task.scheduledDate !== 'Today' && task.status !== 'missed'
        : task.status === 'missed';
    
    // For principals: show all or filter by "mine" (assigned to Principal)
    const ownerMatch = isPrincipal 
      ? (viewMode === 'all' || task.assignedTo === 'Principal')
      : true;
    
    return dateMatch && ownerMatch;
  });

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'missed':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Clock className="w-5 h-5 text-warning" />;
    }
  };

  return (
    <AppLayout title="Tasks">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {isPrincipal ? (viewMode === 'all' ? 'All Tasks' : 'My Tasks') : 'My Tasks'}
            </h2>
            <p className="text-sm text-muted-foreground">Track scheduled duties</p>
          </div>
          {isPrincipal && (
            <Button variant="default" size="sm" onClick={() => navigate('/tasks/new')}>
              <Plus className="w-4 h-4" />
              Add
            </Button>
          )}
        </div>

        {/* View Mode Toggle for Principal */}
        {isPrincipal && (
          <div className="flex gap-2 animate-slide-up">
            <button
              onClick={() => setViewMode('mine')}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                viewMode === 'mine'
                  ? 'bg-accent text-accent-foreground shadow-md'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <User className="w-4 h-4" />
              My Tasks
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                viewMode === 'all'
                  ? 'bg-accent text-accent-foreground shadow-md'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <Users className="w-4 h-4" />
              All Teachers
            </button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 animate-slide-up">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeFilter === tab.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeFilter === tab.id ? 'bg-primary-foreground/20' : 'bg-muted-foreground/20'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <Card variant="flat" className="animate-fade-in">
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
                <p className="font-medium text-foreground">All caught up!</p>
                <p className="text-sm text-muted-foreground">No tasks in this category</p>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task, index) => (
              <Card 
                key={task.id}
                variant="interactive"
                onClick={() => navigate(`/tasks/${task.id}`)}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'backwards' }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      task.status === 'missed' ? 'bg-destructive-light' : 
                      task.status === 'completed' ? 'bg-success-light' : 'bg-warning-light'
                    }`}>
                      {getStatusIcon(task.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground">{task.dutyName}</p>
                          <h3 className="font-semibold text-foreground">{task.title}</h3>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      </div>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {task.scheduledDate}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {task.scheduledTime}
                        </div>
                        {isPrincipal && viewMode === 'all' && task.assignedTo && (
                          <Badge variant="secondary" className="text-xs">
                            {task.assignedTo}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
