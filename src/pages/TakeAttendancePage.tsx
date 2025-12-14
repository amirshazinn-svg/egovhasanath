import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sun, 
  Sunset, 
  Search,
  X,
  Check,
  Users,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  mockAttendanceClasses, 
  mockStudentsForAttendance,
  checkDuplicateAttendance,
  submitAttendance,
  getStudentsByClass
} from '@/data/academicMockData';
import { format } from 'date-fns';

export default function TakeAttendancePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSession, setSelectedSession] = useState<'morning' | 'afternoon'>('morning');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [searchQuery, setSearchQuery] = useState('');
  const [absentStudents, setAbsentStudents] = useState<string[]>([]);
  const [students, setStudents] = useState<typeof mockStudentsForAttendance>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);

  const selectedClassInfo = mockAttendanceClasses.find(c => c.id === selectedClass);

  useEffect(() => {
    if (selectedClass) {
      loadStudents();
      checkDuplicate();
    }
  }, [selectedClass, selectedDate, selectedSession]);

  const loadStudents = async () => {
    const data = await getStudentsByClass(selectedClass);
    setStudents(data);
    setAbsentStudents([]);
  };

  const checkDuplicate = async () => {
    const isDuplicate = await checkDuplicateAttendance(selectedClass, selectedDate, selectedSession);
    setDuplicateError(isDuplicate);
  };

  const filteredStudents = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return students.filter(s => 
      s.name.toLowerCase().includes(query) || 
      s.rollNumber.includes(query)
    ).slice(0, 5);
  }, [students, searchQuery]);

  const addAbsent = (studentId: string) => {
    if (!absentStudents.includes(studentId)) {
      setAbsentStudents([...absentStudents, studentId]);
    }
    setSearchQuery('');
  };

  const removeAbsent = (studentId: string) => {
    setAbsentStudents(absentStudents.filter(id => id !== studentId));
  };

  const handleSubmit = async () => {
    if (!selectedClass || !selectedClassInfo) {
      toast.error('Please select a class');
      return;
    }

    if (duplicateError) {
      toast.error('Attendance already taken for this session');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitAttendance(
        selectedClass,
        selectedClassInfo.name,
        selectedDate,
        selectedSession,
        absentStudents,
        user?.id || 't1',
        user?.name || 'Teacher'
      );
      toast.success('Attendance submitted successfully');
      navigate('/attendance');
    } catch (error) {
      toast.error('Failed to submit attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  const absentStudentDetails = students.filter(s => absentStudents.includes(s.id));
  const presentCount = selectedClassInfo ? selectedClassInfo.studentCount - absentStudents.length : 0;

  return (
    <AppLayout title="Take Attendance" showBack>
      <div className="p-4 space-y-6">
        {/* Class Selection */}
        <div className="space-y-2">
          <Label>Select Class</Label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a class" />
            </SelectTrigger>
            <SelectContent>
              {mockAttendanceClasses.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name} ({cls.studentCount} students)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Selection */}
        <div className="space-y-2">
          <Label>Date</Label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* Session Selection */}
        <div className="space-y-2">
          <Label>Session</Label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={selectedSession === 'morning' ? 'default' : 'outline'}
              className="h-14"
              onClick={() => setSelectedSession('morning')}
            >
              <Sun className="w-5 h-5 mr-2" />
              Morning
            </Button>
            <Button
              variant={selectedSession === 'afternoon' ? 'default' : 'outline'}
              className="h-14"
              onClick={() => setSelectedSession('afternoon')}
            >
              <Sunset className="w-5 h-5 mr-2" />
              Afternoon
            </Button>
          </div>
        </div>

        {/* Duplicate Error */}
        {duplicateError && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <p className="text-sm text-destructive">
                Attendance already taken for this class, date, and session
              </p>
            </CardContent>
          </Card>
        )}

        {/* Mark Absent Section */}
        {selectedClass && !duplicateError && (
          <>
            <Card variant="elevated">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">
                      {selectedClassInfo?.name}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="success">{presentCount} Present</Badge>
                    <Badge variant="destructive">{absentStudents.length} Absent</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  By default, all students are marked present. Type names of absent students below.
                </p>
              </CardContent>
            </Card>

            {/* Search Input with Autocomplete */}
            <div className="space-y-2 relative">
              <Label>Mark Absent (type student name)</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or roll number..."
                  className="pl-10"
                />
              </div>
              
              {/* Autocomplete Dropdown */}
              {filteredStudents.length > 0 && (
                <Card className="absolute z-10 w-full mt-1 shadow-lg">
                  <CardContent className="p-2">
                    {filteredStudents.map((student) => (
                      <button
                        key={student.id}
                        className={`w-full p-3 text-left rounded-lg flex items-center justify-between hover:bg-secondary transition-colors ${
                          absentStudents.includes(student.id) ? 'opacity-50' : ''
                        }`}
                        onClick={() => addAbsent(student.id)}
                        disabled={absentStudents.includes(student.id)}
                      >
                        <div>
                          <p className="font-medium text-foreground">{student.name}</p>
                          <p className="text-sm text-muted-foreground">Roll: {student.rollNumber}</p>
                        </div>
                        {absentStudents.includes(student.id) ? (
                          <Badge variant="destructive">Already Absent</Badge>
                        ) : (
                          <Badge variant="outline">Mark Absent</Badge>
                        )}
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Absent Students List */}
            {absentStudentDetails.length > 0 && (
              <div className="space-y-3">
                <Label>Absent Students ({absentStudentDetails.length})</Label>
                <div className="space-y-2">
                  {absentStudentDetails.map((student) => (
                    <Card key={student.id} className="border-destructive/30 bg-destructive/5">
                      <CardContent className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{student.name}</p>
                          <p className="text-sm text-muted-foreground">Roll: {student.rollNumber}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAbsent(student.id)}
                        >
                          <X className="w-4 h-4 text-destructive" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              variant="touch" 
              className="w-full"
              onClick={handleSubmit}
              disabled={isSubmitting || duplicateError}
            >
              <Check className="w-5 h-5 mr-2" />
              {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
            </Button>
          </>
        )}
      </div>
    </AppLayout>
  );
}
