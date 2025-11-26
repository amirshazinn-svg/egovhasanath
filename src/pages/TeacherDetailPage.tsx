import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Briefcase, CheckSquare, RotateCcw, Plus, X, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Duty {
  id: string;
  name: string;
  category: 'responsibility' | 'rotational';
  frequency: string;
}

interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'missed';
}

const teachersData: Record<string, {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department: string;
  initials: string;
  duties: Duty[];
  tasks: Task[];
  completedTasks: number;
  totalTasks: number;
}> = {
  '1': {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@school.edu',
    phone: '+1 234 567 890',
    role: 'Senior Teacher',
    department: 'Science',
    initials: 'JS',
    duties: [
      { id: '1', name: 'Morning Assembly', category: 'rotational', frequency: 'Weekly' },
      { id: '2', name: 'Lab Supervision', category: 'responsibility', frequency: 'Daily' },
      { id: '5', name: 'Bus Duty', category: 'rotational', frequency: 'Daily' },
    ],
    tasks: [
      { id: '1', title: 'Morning Assembly Report', dueDate: 'Today', status: 'pending' },
      { id: '2', title: 'Lab Equipment Check', dueDate: 'Tomorrow', status: 'pending' },
    ],
    completedTasks: 23,
    totalTasks: 28,
  },
  '2': {
    id: '2',
    name: 'Jane Doe',
    email: 'jane.doe@school.edu',
    phone: '+1 234 567 891',
    role: 'Teacher',
    department: 'Mathematics',
    initials: 'JD',
    duties: [
      { id: '3', name: 'Library Duty', category: 'rotational', frequency: 'Weekly' },
      { id: '4', name: 'Sports Coordinator', category: 'responsibility', frequency: 'As needed' },
    ],
    tasks: [
      { id: '3', title: 'Library Report', dueDate: 'Wed, Dec 4', status: 'pending' },
    ],
    completedTasks: 15,
    totalTasks: 18,
  },
};

const allDuties: Duty[] = [
  { id: '1', name: 'Morning Assembly', category: 'rotational', frequency: 'Weekly' },
  { id: '2', name: 'Lab Supervision', category: 'responsibility', frequency: 'Daily' },
  { id: '3', name: 'Library Duty', category: 'rotational', frequency: 'Weekly' },
  { id: '4', name: 'Sports Coordinator', category: 'responsibility', frequency: 'As needed' },
  { id: '5', name: 'Bus Duty', category: 'rotational', frequency: 'Daily' },
  { id: '6', name: 'Cafeteria Supervision', category: 'rotational', frequency: 'Daily' },
  { id: '7', name: 'Exam Coordinator', category: 'responsibility', frequency: 'As needed' },
];

export default function TeacherDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [teacher, setTeacher] = useState(teachersData[id || '1'] || teachersData['1']);
  const [showDutyModal, setShowDutyModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', dueDate: '', dutyId: '' });

  const handleAssignDuty = (duty: Duty) => {
    if (teacher.duties.find(d => d.id === duty.id)) {
      toast.error('Duty already assigned');
      return;
    }
    setTeacher({
      ...teacher,
      duties: [...teacher.duties, duty],
    });
    toast.success(`${duty.name} assigned`);
    setShowDutyModal(false);
  };

  const handleRemoveDuty = (dutyId: string) => {
    setTeacher({
      ...teacher,
      duties: teacher.duties.filter(d => d.id !== dutyId),
    });
    toast.success('Duty removed');
  };

  const handleAssignTask = () => {
    if (!newTask.title || !newTask.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    const task: Task = {
      id: String(Date.now()),
      title: newTask.title,
      dueDate: newTask.dueDate,
      status: 'pending',
    };
    setTeacher({
      ...teacher,
      tasks: [...teacher.tasks, task],
      totalTasks: teacher.totalTasks + 1,
    });
    setNewTask({ title: '', dueDate: '', dutyId: '' });
    setShowTaskModal(false);
    toast.success('Task assigned');
  };

  const completionRate = Math.round((teacher.completedTasks / teacher.totalTasks) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center h-14 px-4 max-w-lg mx-auto">
          <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold text-foreground ml-3">Teacher Profile</h1>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto pb-8 space-y-6">
        {/* Profile Card */}
        <Card className="animate-fade-in">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-foreground">{teacher.initials}</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">{teacher.name}</h2>
            <p className="text-muted-foreground">{teacher.role}</p>
            <Badge variant="secondary" className="mt-2">{teacher.department}</Badge>

            <div className="flex items-center justify-center gap-6 mt-6">
              {teacher.email && (
                <a href={`mailto:${teacher.email}`} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-xs">Email</span>
                </a>
              )}
              {teacher.phone && (
                <a href={`tel:${teacher.phone}`} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-xs">Call</span>
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-4">Activity Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{teacher.duties.length}</p>
                <p className="text-xs text-muted-foreground">Duties</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">{teacher.tasks.length}</p>
                <p className="text-xs text-muted-foreground">Pending Tasks</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{completionRate}%</p>
                <p className="text-xs text-muted-foreground">Completion</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Duties */}
        <div className="animate-slide-up" style={{ animationDelay: '0.15s', animationFillMode: 'backwards' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Assigned Duties</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowDutyModal(true)}>
              <Plus className="w-4 h-4" />
              Assign
            </Button>
          </div>
          <div className="space-y-2">
            {teacher.duties.map((duty) => (
              <Card key={duty.id}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      duty.category === 'rotational' ? 'bg-accent-light' : 'bg-primary-light'
                    }`}>
                      {duty.category === 'rotational' ? (
                        <RotateCcw className="w-5 h-5 text-accent" />
                      ) : (
                        <Briefcase className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{duty.name}</p>
                      <p className="text-xs text-muted-foreground">{duty.frequency}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleRemoveDuty(duty.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {teacher.duties.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No duties assigned</p>
            )}
          </div>
        </div>

        {/* Assigned Tasks */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Pending Tasks</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowTaskModal(true)}>
              <Plus className="w-4 h-4" />
              Assign
            </Button>
          </div>
          <div className="space-y-2">
            {teacher.tasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                      <CheckSquare className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{task.title}</p>
                      <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
                    </div>
                    <Badge variant={task.status === 'pending' ? 'warning' : 'success'}>
                      {task.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            {teacher.tasks.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No pending tasks</p>
            )}
          </div>
        </div>
      </main>

      {/* Duty Assignment Modal */}
      {showDutyModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/20 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-lg rounded-t-3xl rounded-b-none animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Assign Duty</h3>
                <Button variant="ghost" size="icon-sm" onClick={() => setShowDutyModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="space-y-2 max-h-64 overflow-auto">
                {allDuties.map((duty) => {
                  const isAssigned = teacher.duties.find(d => d.id === duty.id);
                  return (
                    <button
                      key={duty.id}
                      onClick={() => !isAssigned && handleAssignDuty(duty)}
                      disabled={!!isAssigned}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                        isAssigned ? 'opacity-50 bg-secondary' : 'hover:bg-secondary'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        duty.category === 'rotational' ? 'bg-accent-light' : 'bg-primary-light'
                      }`}>
                        {duty.category === 'rotational' ? (
                          <RotateCcw className="w-5 h-5 text-accent" />
                        ) : (
                          <Briefcase className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{duty.name}</p>
                        <p className="text-xs text-muted-foreground">{duty.frequency}</p>
                      </div>
                      {isAssigned && (
                        <Badge variant="secondary">Assigned</Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Task Assignment Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/20 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-lg rounded-t-3xl rounded-b-none animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-foreground">Assign Task</h3>
                <Button variant="ghost" size="icon-sm" onClick={() => setShowTaskModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Task Title <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="Enter task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Due Date <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Related Duty (Optional)
                  </label>
                  <select
                    value={newTask.dutyId}
                    onChange={(e) => setNewTask({ ...newTask, dutyId: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="">Select a duty</option>
                    {teacher.duties.map((duty) => (
                      <option key={duty.id} value={duty.id}>{duty.name}</option>
                    ))}
                  </select>
                </div>
                <Button variant="touch" className="w-full" onClick={handleAssignTask}>
                  Assign Task
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
