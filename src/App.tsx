import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import LoginPage from "./pages/LoginPage";
import SelectRolePage from "./pages/SelectRolePage";
import DashboardPage from "./pages/DashboardPage";
import DutiesPage from "./pages/DutiesPage";
import DutyDetailPage from "./pages/DutyDetailPage";
import DutyPlannerPage from "./pages/DutyPlannerPage";
import TasksPage from "./pages/TasksPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import IssuesPage from "./pages/IssuesPage";
import IssueDetailPage from "./pages/IssueDetailPage";
import SubmitReportPage from "./pages/SubmitReportPage";
import RaiseIssuePage from "./pages/RaiseIssuePage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

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
        path="/tasks/:id" 
        element={
          <ProtectedRoute>
            <TaskDetailPage />
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
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
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
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
