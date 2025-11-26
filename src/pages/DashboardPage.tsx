import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  CheckSquare, 
  AlertCircle, 
  FileText,
  ChevronRight,
  TrendingUp,
  Clock,
  AlertTriangle,
  Users,
  Plus
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';

const stats = [
  { label: 'Pending Tasks', value: '5', icon: Clock, color: 'bg-warning-light text-warning-foreground' },
  { label: 'Completed', value: '12', icon: TrendingUp, color: 'bg-success-light text-success' },
  { label: 'Open Issues', value: '2', icon: AlertTriangle, color: 'bg-destructive-light text-destructive' },
];

const principalStats = [
  { label: 'Teachers', value: '24', icon: Users, color: 'bg-primary-light text-primary' },
  { label: 'Active Tasks', value: '38', icon: CheckSquare, color: 'bg-accent-light text-accent' },
  { label: 'Open Issues', value: '5', icon: AlertTriangle, color: 'bg-destructive-light text-destructive' },
];

const teacherQuickActions = [
  { 
    title: 'My Duties', 
    description: '3 active duties', 
    icon: ClipboardList, 
    path: '/duties',
    color: 'bg-primary'
  },
  { 
    title: 'My Tasks', 
    description: '5 pending today', 
    icon: CheckSquare, 
    path: '/tasks',
    color: 'bg-accent'
  },
  { 
    title: 'Raise Issue', 
    description: 'Report a problem', 
    icon: AlertCircle, 
    path: '/issues/new',
    color: 'bg-destructive'
  },
  { 
    title: 'Submit Report', 
    description: 'Complete a duty', 
    icon: FileText, 
    path: '/reports/new',
    color: 'bg-success'
  },
];

const principalQuickActions = [
  { 
    title: 'Teachers', 
    description: 'Manage staff', 
    icon: Users, 
    path: '/teachers',
    color: 'bg-primary'
  },
  { 
    title: 'Create Duty', 
    description: 'Add new duty', 
    icon: ClipboardList, 
    path: '/duties/new',
    color: 'bg-accent'
  },
  { 
    title: 'Create Task', 
    description: 'Assign task', 
    icon: Plus, 
    path: '/tasks/new',
    color: 'bg-success'
  },
  { 
    title: 'All Issues', 
    description: '5 open issues', 
    icon: AlertCircle, 
    path: '/issues',
    color: 'bg-destructive'
  },
];

const upcomingTasks = [
  { id: '1', title: 'Morning Assembly Duty', time: '8:00 AM', status: 'pending' },
  { id: '2', title: 'Lab Equipment Check', time: '10:30 AM', status: 'pending' },
  { id: '3', title: 'Staff Meeting Notes', time: '2:00 PM', status: 'completed' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPrincipal = user?.role === 'principal' || user?.role === 'manager';
  const currentStats = isPrincipal ? principalStats : stats;
  const quickActions = isPrincipal ? principalQuickActions : teacherQuickActions;

  return (
    <AppLayout title="Dashboard">
      <div className="p-4 space-y-6">
        {/* Greeting */}
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-foreground">
            Good morning, {user?.name?.split(' ')[0] || 'User'}!
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Here's your overview for today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 animate-slide-up">
          {currentStats.map((stat) => (
            <Card key={stat.label} variant="stat" className="text-center">
              <CardContent className="p-3">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="animate-slide-up stagger-2" style={{ animationFillMode: 'backwards' }}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Card 
                key={action.title}
                variant="interactive"
                onClick={() => navigate(action.path)}
              >
                <CardContent className="p-4">
                  <div className={`w-11 h-11 rounded-xl ${action.color} flex items-center justify-center mb-3`}>
                    <action.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h4 className="font-semibold text-foreground text-sm">{action.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="animate-slide-up stagger-3" style={{ animationFillMode: 'backwards' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Today's Tasks
            </h3>
            <button 
              onClick={() => navigate('/tasks')}
              className="text-sm text-primary font-medium flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {upcomingTasks.map((task) => (
              <Card 
                key={task.id}
                variant="interactive"
                onClick={() => navigate(`/tasks/${task.id}`)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      task.status === 'completed' ? 'bg-success' : 'bg-warning'
                    }`} />
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.time}</p>
                    </div>
                  </div>
                  <Badge variant={task.status === 'completed' ? 'completed' : 'pending'}>
                    {task.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
