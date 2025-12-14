import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  GraduationCap,
  Star,
  ChevronRight,
  ArrowLeft,
  Filter
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockStudentProfiles, StudentProfile } from '@/data/studentMockData';

export default function StudentDirectoryPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  const departments = ['all', ...new Set(mockStudentProfiles.map(s => s.department))];

  const filteredStudents = mockStudentProfiles.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.class.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || student.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">Student Directory</h1>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-4">
        {/* Search */}
        <div className="relative animate-slide-up">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
            variant="filled"
          />
        </div>

        {/* Department Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 animate-slide-up stagger-1">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {departments.map((dept) => (
            <Button
              key={dept}
              variant={departmentFilter === dept ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDepartmentFilter(dept)}
              className="flex-shrink-0 capitalize"
            >
              {dept === 'all' ? 'All Departments' : dept}
            </Button>
          ))}
        </div>

        {/* Student List */}
        <div className="space-y-3">
          {filteredStudents.map((student, index) => (
            <StudentCard 
              key={student.id} 
              student={student} 
              index={index}
              onClick={() => navigate(`/students/${student.username}`)}
            />
          ))}

          {filteredStudents.length === 0 && (
            <Card variant="flat">
              <CardContent className="p-8 text-center">
                <GraduationCap className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No students found</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Student Login Link */}
        <div className="text-center pt-6">
          <Button
            variant="outline"
            onClick={() => navigate('/student/login')}
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            Student Login
          </Button>
        </div>
      </div>
    </div>
  );
}

function StudentCard({ 
  student, 
  index,
  onClick 
}: { 
  student: StudentProfile; 
  index: number;
  onClick: () => void;
}) {
  return (
    <Card 
      variant="interactive" 
      className={`cursor-pointer animate-slide-up stagger-${Math.min(index + 1, 5)}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={student.photo} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {student.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{student.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{student.department}</Badge>
              <span className="text-xs text-muted-foreground">{student.class}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="font-semibold text-sm">{student.stars}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
