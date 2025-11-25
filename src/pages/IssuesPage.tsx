import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, ChevronRight, Clock, User, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';

type IssueFilter = 'all' | 'open' | 'resolved';

interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'resolved' | 'forwarded';
  responsiblePerson: string;
  createdAt: string;
  updatedAt: string;
}

const issues: Issue[] = [
  {
    id: '1',
    title: 'Projector not working in Room 201',
    description: 'The projector has been showing blank screen since morning',
    category: 'Infrastructure',
    priority: 'high',
    status: 'open',
    responsiblePerson: 'IT Department',
    createdAt: '2 hours ago',
    updatedAt: '1 hour ago',
  },
  {
    id: '2',
    title: 'Missing lab equipment',
    description: 'Chemistry beakers and test tubes are missing from lab inventory',
    category: 'Inventory',
    priority: 'medium',
    status: 'forwarded',
    responsiblePerson: 'Lab Coordinator',
    createdAt: 'Yesterday',
    updatedAt: '5 hours ago',
  },
  {
    id: '3',
    title: 'AC maintenance required',
    description: 'Staff room AC is not cooling properly',
    category: 'Maintenance',
    priority: 'low',
    status: 'resolved',
    responsiblePerson: 'Maintenance Team',
    createdAt: '3 days ago',
    updatedAt: '1 day ago',
  },
  {
    id: '4',
    title: 'Student discipline concern',
    description: 'Repeated tardiness in Class 9B needs attention',
    category: 'Discipline',
    priority: 'medium',
    status: 'open',
    responsiblePerson: 'Class Teacher',
    createdAt: '1 day ago',
    updatedAt: '1 day ago',
  },
];

const filterTabs: { id: IssueFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'resolved', label: 'Resolved' },
];

export default function IssuesPage() {
  const [activeFilter, setActiveFilter] = useState<IssueFilter>('all');
  const navigate = useNavigate();

  const filteredIssues = issues.filter(
    issue => activeFilter === 'all' || issue.status === activeFilter || 
    (activeFilter === 'open' && issue.status === 'forwarded')
  );

  const getPriorityColor = (priority: Issue['priority']) => {
    switch (priority) {
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'secondary';
    }
  };

  const getStatusBadge = (status: Issue['status']) => {
    switch (status) {
      case 'open': return 'open';
      case 'resolved': return 'resolved';
      case 'forwarded': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <AppLayout title="Issues">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-foreground">Issues</h2>
            <p className="text-sm text-muted-foreground">{filteredIssues.length} issues</p>
          </div>
          <Button variant="default" size="sm" onClick={() => navigate('/issues/new')}>
            <Plus className="w-4 h-4" />
            Raise
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 animate-slide-up">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeFilter === tab.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Issues List */}
        <div className="space-y-3">
          {filteredIssues.map((issue, index) => (
            <Card 
              key={issue.id}
              variant="interactive"
              onClick={() => navigate(`/issues/${issue.id}`)}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'backwards' }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-semibold text-foreground line-clamp-1">{issue.title}</h3>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {issue.description}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={getStatusBadge(issue.status)}>
                    {issue.status}
                  </Badge>
                  <Badge variant={getPriorityColor(issue.priority)}>
                    {issue.priority}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Tag className="w-3 h-3" />
                    {issue.category}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <User className="w-3.5 h-3.5" />
                    {issue.responsiblePerson}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {issue.createdAt}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
