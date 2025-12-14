import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { StudentAuthProvider, useStudentAuth } from "@/contexts/StudentAuthContext";

// Staff Pages
import LoginPage from "./pages/LoginPage";
import SelectRolePage from "./pages/SelectRolePage";
import DashboardPage from "./pages/DashboardPage";
import DutiesPage from "./pages/DutiesPage";
import DutyDetailPage from "./pages/DutyDetailPage";
import DutyPlannerPage from "./pages/DutyPlannerPage";
import CreateDutyPage from "./pages/CreateDutyPage";
import TasksPage from "./pages/TasksPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import CreateTaskPage from "./pages/CreateTaskPage";
import IssuesPage from "./pages/IssuesPage";
import IssueDetailPage from "./pages/IssueDetailPage";
import SubmitReportPage from "./pages/SubmitReportPage";
import RaiseIssuePage from "./pages/RaiseIssuePage";
import ProfilePage from "./pages/ProfilePage";
import TeachersPage from "./pages/TeachersPage";
import TeacherDetailPage from "./pages/TeacherDetailPage";
import ReportsPage from "./pages/ReportsPage";
import ReportDetailPage from "./pages/ReportDetailPage";
import NotFound from "./pages/NotFound";

// Student Pages
import StudentLoginPage from "./pages/student/StudentLoginPage";
import StudentDashboardPage from "./pages/student/StudentDashboardPage";
import StudentAccountPage from "./pages/student/StudentAccountPage";
import StudentAchievementsPage from "./pages/student/StudentAchievementsPage";
import AddAchievementPage from "./pages/student/AddAchievementPage";
import StudentLeaderboardPage from "./pages/student/StudentLeaderboardPage";
import StudentProfilePage from "./pages/student/StudentProfilePage";
import PublicLeaderboardPage from "./pages/student/PublicLeaderboardPage";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (!user?.role) {
    return <Navigate to="/select-role" replace />;
  }
  
  return <>{children}</>;
}

function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function StudentProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useStudentAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/student/login" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          isAuthenticated && user?.role 
            ? <Navigate to="/dashboard" replace /> 
            : <LoginPage />
        } 
      />
      <Route 
        path="/select-role" 
        element={
          <AuthenticatedRoute>
            <SelectRolePage />
          </AuthenticatedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/duties" 
        element={
          <ProtectedRoute>
            <DutiesPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/duties/planner" 
        element={
          <ProtectedRoute>
            <DutyPlannerPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/duties/new" 
        element={
          <ProtectedRoute>
            <CreateDutyPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/duties/:id" 
        element={
          <ProtectedRoute>
            <DutyDetailPage />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/tasks" 
        element={
          <ProtectedRoute>
            <TasksPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tasks/new" 
        element={
          <ProtectedRoute>
            <CreateTaskPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tasks/:id" 
        element={
          <ProtectedRoute>
            <TaskDetailPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teachers" 
        element={
          <ProtectedRoute>
            <TeachersPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teachers/:id" 
        element={
          <ProtectedRoute>
            <TeacherDetailPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/issues/:id"
        element={
          <ProtectedRoute>
            <IssueDetailPage />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/issues" 
        element={
          <ProtectedRoute>
            <IssuesPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/issues/new" 
        element={
          <ProtectedRoute>
            <RaiseIssuePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reports/new" 
        element={
          <ProtectedRoute>
            <SubmitReportPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reports" 
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reports/:id" 
        element={
          <ProtectedRoute>
            <ReportDetailPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />

      {/* Public Route - Leaderboard Only */}
      <Route path="/leaderboard" element={<PublicLeaderboardPage />} />

      {/* Student Portal Routes - All Protected */}
      <Route path="/student/login" element={<StudentLoginPage />} />
      <Route 
        path="/student/dashboard" 
        element={
          <StudentProtectedRoute>
            <StudentDashboardPage />
          </StudentProtectedRoute>
        } 
      />
      <Route 
        path="/student/account" 
        element={
          <StudentProtectedRoute>
            <StudentAccountPage />
          </StudentProtectedRoute>
        } 
      />
      <Route 
        path="/student/achievements" 
        element={
          <StudentProtectedRoute>
            <StudentAchievementsPage />
          </StudentProtectedRoute>
        } 
      />
      <Route 
        path="/student/achievements/new" 
        element={
          <StudentProtectedRoute>
            <AddAchievementPage />
          </StudentProtectedRoute>
        } 
      />
      <Route 
        path="/student/leaderboard" 
        element={
          <StudentProtectedRoute>
            <StudentLeaderboardPage />
          </StudentProtectedRoute>
        } 
      />
      <Route 
        path="/student/profile" 
        element={
          <StudentProtectedRoute>
            <StudentProfilePage />
          </StudentProtectedRoute>
        } 
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <StudentAuthProvider>
            <AppRoutes />
          </StudentAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
