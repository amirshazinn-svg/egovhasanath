import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle,
  Plus,
  ChevronRight,
  Sun,
  Sunset
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  mockAttendanceRecords, 
  mockAttendanceClasses,
  getAttendanceRecords 
} from '@/data/academicMockData';
import { format } from 'date-fns';

export default function AttendancePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPrincipal = user?.role === 'principal' || user?.role === 'manager';
  const [records, setRecords] = useState(mockAttendanceRecords);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    loadRecords();
  }, [selectedDate]);

  const loadRecords = async () => {
    const data = await getAttendanceRecords({ date: selectedDate });
    setRecords(data);
  };

  const todayStats = {
    classesCompleted: records.filter(r => r.date === selectedDate).length,
    totalClasses: mockAttendanceClasses.length * 2, // Morning + Afternoon
    totalPresent: records.filter(r => r.date === selectedDate).reduce((sum, r) => sum + r.presentCount, 0),
    totalAbsent: records.filter(r => r.date === selectedDate).reduce((sum, r) => sum + r.absentCount, 0)
  };

  return (
    <AppLayout title="Attendance" showBack>
      <div className="p-4 space-y-6">
        {/* Date Selector */}
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-primary" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex-1 px-4 py-2 bg-card border border-border rounded-xl text-foreground"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card variant="stat">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-success">{todayStats.totalPresent}</p>
                  <p className="text-xs text-muted-foreground">Present Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card variant="stat">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">{todayStats.totalAbsent}</p>
                  <p className="text-xs text-muted-foreground">Absent Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Take Attendance Button */}
        <Button 
          variant="touch" 
          className="w-full"
          onClick={() => navigate('/attendance/take')}
        >
          <Plus className="w-5 h-5 mr-2" />
          Take Attendance
        </Button>

        {/* Today's Records */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Records for {format(new Date(selectedDate), 'MMM d, yyyy')}
          </h3>
          
          {records.filter(r => r.date === selectedDate).length === 0 ? (
            <Card variant="elevated">
              <CardContent className="p-6 text-center">
                <Clock className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No attendance records for this date</p>
              </CardContent>
            </Card>
          ) : (
            records
              .filter(r => r.date === selectedDate)
              .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
              .map((record) => (
                <Card 
                  key={record.id} 
                  variant="interactive"
                  onClick={() => navigate(`/attendance/${record.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          record.session === 'morning' 
                            ? 'bg-accent/10' 
                            : 'bg-warning/10'
                        }`}>
                          {record.session === 'morning' 
                            ? <Sun className="w-5 h-5 text-accent" />
                            : <Sunset className="w-5 h-5 text-warning" />
                          }
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{record.className}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {record.session} Session
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Badge variant="success">{record.presentCount}P</Badge>
                          <Badge variant="destructive">{record.absentCount}A</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {record.teacherName}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>

        {/* All Classes Summary */}
        {isPrincipal && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              All Classes
            </h3>
            {mockAttendanceClasses.map((cls) => {
              const morningDone = records.some(r => r.classId === cls.id && r.date === selectedDate && r.session === 'morning');
              const afternoonDone = records.some(r => r.classId === cls.id && r.date === selectedDate && r.session === 'afternoon');
              
              return (
                <Card key={cls.id} variant="elevated">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{cls.name}</p>
                        <p className="text-sm text-muted-foreground">{cls.teacherName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={morningDone ? 'success' : 'outline'}>
                          <Sun className="w-3 h-3 mr-1" />
                          AM
                        </Badge>
                        <Badge variant={afternoonDone ? 'success' : 'outline'}>
                          <Sunset className="w-3 h-3 mr-1" />
                          PM
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
