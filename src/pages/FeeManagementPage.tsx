import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, IndianRupee, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import {
  getStudentFees,
  getStudentFeeOverview,
  getFeeClasses,
  getCurrentAcademicYear,
  formatMonth,
  StudentFee,
  MonthlyFeeStatus,
} from '@/data/feeMockData';

interface StudentFeeWithOverview extends StudentFee {
  totalPending: number;
  lastPaymentDate: string | null;
  currentMonthStatus: MonthlyFeeStatus | null;
  overallStatus: 'paid' | 'partial' | 'due';
}

const FeeManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentFeeWithOverview[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentFeeWithOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  
  const currentMonth = new Date().toISOString().slice(0, 7);
  const academicYear = getCurrentAcademicYear();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchQuery, classFilter, statusFilter, students]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [studentFees, classList] = await Promise.all([
        getStudentFees(academicYear.id),
        getFeeClasses(),
      ]);
      
      // Load overview for each student
      const studentsWithOverview: StudentFeeWithOverview[] = await Promise.all(
        studentFees.map(async (sf) => {
          const overview = await getStudentFeeOverview(sf.id);
          const currentMonthStatus = overview.monthlyStatus.find((m) => m.month === currentMonth) || null;
          
          // Determine overall status
          let overallStatus: 'paid' | 'partial' | 'due' = 'paid';
          if (overview.totalPending > 0) {
            const hasPaidAnything = overview.totalPaid > 0;
            overallStatus = hasPaidAnything ? 'partial' : 'due';
          }
          
          return {
            ...sf,
            totalPending: overview.totalPending,
            lastPaymentDate: overview.lastPaymentDate,
            currentMonthStatus,
            overallStatus,
          };
        })
      );
      
      setStudents(studentsWithOverview);
      setClasses(classList);
    } catch (error) {
      console.error('Error loading fee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((s) =>
        s.studentName.toLowerCase().includes(query)
      );
    }
    
    if (classFilter !== 'all') {
      filtered = filtered.filter((s) => s.classId === classFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter((s) => s.overallStatus === statusFilter);
    }
    
    setFilteredStudents(filtered);
  };

  const getStatusBadge = (status: 'paid' | 'partial' | 'due') => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case 'partial':
        return (
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            <Clock className="w-3 h-3 mr-1" />
            Partial
          </Badge>
        );
      case 'due':
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <AlertCircle className="w-3 h-3 mr-1" />
            Due
          </Badge>
        );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AppLayout title="Fee Management">
      <div className="space-y-4">
        {/* Header Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
            <CardContent className="p-3 text-center">
              <p className="text-xs opacity-80">Paid</p>
              <p className="text-xl font-bold">
                {students.filter((s) => s.overallStatus === 'paid').length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
            <CardContent className="p-3 text-center">
              <p className="text-xs opacity-80">Partial</p>
              <p className="text-xl font-bold">
                {students.filter((s) => s.overallStatus === 'partial').length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
            <CardContent className="p-3 text-center">
              <p className="text-xs opacity-80">Due</p>
              <p className="text-xl font-bold">
                {students.filter((s) => s.overallStatus === 'due').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-3 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="due">Due</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Academic Year Info */}
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-muted-foreground">
            Academic Year: <span className="font-medium text-foreground">{academicYear.name}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            {filteredStudents.length} students
          </p>
        </div>

        {/* Student List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-16 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredStudents.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <IndianRupee className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No students found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredStudents.map((student) => (
              <Card
                key={student.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/fees/${student.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {student.studentName}
                      </h3>
                      <p className="text-sm text-muted-foreground">{student.className}</p>
                      {student.lastPaymentDate && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Last paid: {new Date(student.lastPaymentDate).toLocaleDateString('en-IN')}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      {getStatusBadge(student.overallStatus)}
                      {student.totalPending > 0 && (
                        <p className="text-lg font-bold text-red-600 dark:text-red-400">
                          {formatCurrency(student.totalPending)}
                        </p>
                      )}
                      {student.currentMonthStatus && (
                        <p className="text-xs text-muted-foreground">
                          {formatMonth(currentMonth)}: {getStatusBadge(student.currentMonthStatus.status)}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default FeeManagementPage;
