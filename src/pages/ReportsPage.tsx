import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Filter, ChevronRight, Calendar, User, Paperclip, Eye, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';

type ReportFilter = 'all' | 'pending' | 'reviewed';

interface Report {
  id: string;
  dutyName: string;
  teacherName: string;
  teacherInitials: string;
  submittedDate: string;
  submittedTime: string;
  status: 'pending' | 'reviewed';
  description: string;
  hasAttachments: boolean;
  attachmentCount: number;
}

const reports: Report[] = [
  {
    id: '1',
    dutyName: 'Morning Assembly',
    teacherName: 'John Smith',
    teacherInitials: 'JS',
    submittedDate: 'Today',
    submittedTime: '9:15 AM',
    status: 'pending',
    description: 'Assembly conducted successfully. All students present.',
    hasAttachments: true,
    attachmentCount: 2,
  },
  {
    id: '2',
    dutyName: 'Lab Supervision',
    teacherName: 'Jane Doe',
    teacherInitials: 'JD',
    submittedDate: 'Today',
    submittedTime: '11:30 AM',
    status: 'pending',
    description: 'Chemistry practical completed. One minor incident reported.',
    hasAttachments: true,
    attachmentCount: 3,
  },
  {
    id: '3',
    dutyName: 'Bus Duty',
    teacherName: 'Mike Johnson',
    teacherInitials: 'MJ',
    submittedDate: 'Yesterday',
    submittedTime: '4:00 PM',
    status: 'reviewed',
    description: 'All students departed safely. No issues.',
    hasAttachments: false,
    attachmentCount: 0,
  },
  {
    id: '4',
    dutyName: 'Library Duty',
    teacherName: 'Sarah Williams',
    teacherInitials: 'SW',
    submittedDate: 'Yesterday',
    submittedTime: '1:30 PM',
    status: 'reviewed',
    description: 'Library session completed. 45 students attended.',
    hasAttachments: true,
    attachmentCount: 1,
  },
  {
    id: '5',
    dutyName: 'Morning Assembly',
    teacherName: 'David Brown',
    teacherInitials: 'DB',
    submittedDate: 'Dec 1',
    submittedTime: '9:00 AM',
    status: 'reviewed',
    description: 'Special assembly for Independence Day celebration.',
    hasAttachments: true,
    attachmentCount: 5,
  },
];

const filterTabs: { id: ReportFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'reviewed', label: 'Reviewed' },
];

export default function ReportsPage() {
  const [activeFilter, setActiveFilter] = useState<ReportFilter>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedDuty, setSelectedDuty] = useState<string>('all');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
  const navigate = useNavigate();

  const filteredReports = reports.filter(report => {
    const statusMatch = activeFilter === 'all' || report.status === activeFilter;
    const dutyMatch = selectedDuty === 'all' || report.dutyName === selectedDuty;
    const teacherMatch = selectedTeacher === 'all' || report.teacherName === selectedTeacher;
    return statusMatch && dutyMatch && teacherMatch;
  });

  const uniqueDuties = [...new Set(reports.map(r => r.dutyName))];
  const uniqueTeachers = [...new Set(reports.map(r => r.teacherName))];

  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const reviewedCount = reports.filter(r => r.status === 'reviewed').length;

  return (
    <AppLayout title="Reports">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-foreground">Duty Reports</h2>
            <p className="text-sm text-muted-foreground">
              {pendingCount} pending • {reviewedCount} reviewed
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setShowFilterModal(true)}>
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        {/* Status Tabs */}
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

        {/* Active Filters Display */}
        {(selectedDuty !== 'all' || selectedTeacher !== 'all') && (
          <div className="flex flex-wrap gap-2 animate-fade-in">
            {selectedDuty !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                Duty: {selectedDuty}
                <button onClick={() => setSelectedDuty('all')} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            )}
            {selectedTeacher !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                Teacher: {selectedTeacher}
                <button onClick={() => setSelectedTeacher('all')} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            )}
          </div>
        )}

        {/* Reports List */}
        <div className="space-y-3">
          {filteredReports.length === 0 ? (
            <Card variant="flat" className="animate-fade-in">
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium text-foreground">No reports found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </CardContent>
            </Card>
          ) : (
            filteredReports.map((report, index) => (
              <Card
                key={report.id}
                variant="interactive"
                onClick={() => navigate(`/reports/${report.id}`)}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'backwards' }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-primary-foreground">
                        {report.teacherInitials}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{report.dutyName}</h3>
                          <p className="text-sm text-muted-foreground">{report.teacherName}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                        {report.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant={report.status === 'pending' ? 'warning' : 'success'}>
                          {report.status === 'pending' ? (
                            <><Clock className="w-3 h-3 mr-1" /> Pending</>
                          ) : (
                            <><CheckCircle2 className="w-3 h-3 mr-1" /> Reviewed</>
                          )}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {report.submittedDate}
                        </span>
                        {report.hasAttachments && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Paperclip className="w-3 h-3" />
                            {report.attachmentCount}
                          </span>
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

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm animate-fade-in p-4">
          <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto animate-scale-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Filter Reports</h3>
                <Button variant="ghost" size="icon-sm" onClick={() => setShowFilterModal(false)}>
                  ✕
                </Button>
              </div>
              
              {/* Filter by Duty */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Filter by Duty
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedDuty('all')}
                    className={`w-full px-4 py-3 rounded-xl text-left text-sm font-medium transition-all duration-200 ${
                      selectedDuty === 'all'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    All Duties
                  </button>
                  {uniqueDuties.map(duty => (
                    <button
                      key={duty}
                      onClick={() => setSelectedDuty(duty)}
                      className={`w-full px-4 py-3 rounded-xl text-left text-sm font-medium transition-all duration-200 ${
                        selectedDuty === duty
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {duty}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter by Teacher */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Filter by Teacher
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedTeacher('all')}
                    className={`w-full px-4 py-3 rounded-xl text-left text-sm font-medium transition-all duration-200 ${
                      selectedTeacher === 'all'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    All Teachers
                  </button>
                  {uniqueTeachers.map(teacher => (
                    <button
                      key={teacher}
                      onClick={() => setSelectedTeacher(teacher)}
                      className={`w-full px-4 py-3 rounded-xl text-left text-sm font-medium transition-all duration-200 ${
                        selectedTeacher === teacher
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {teacher}
                    </button>
                  ))}
                </div>
              </div>

              <Button variant="touch" className="w-full" onClick={() => setShowFilterModal(false)}>
                Apply Filters
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </AppLayout>
  );
}
