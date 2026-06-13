import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import DashboardLayout from "./components/DashboardLayout";
import UserDashboard from "./components/UserDashboard";
import ContactsManagement from "./components/ContactsManagement";
import MessageTemplates from "./components/MessageTemplates";
import SendMessage from "./components/SendMessage";
import ScheduleMessage from "./components/ScheduleMessage";
import MessageLogs from "./components/MessageLogs";
import AdminDashboard from "./components/AdminDashboard";
import UserManagement from "./components/UserManagement";
import APIConfiguration from "./components/APIConfiguration";
import SystemLogs from "./components/SystemLogs";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Load auth state from localStorage on mount
    return localStorage.getItem("isAuthenticated") === "true";
  });

  useEffect(() => {
    // Persist auth state to localStorage
    localStorage.setItem("isAuthenticated", isAuthenticated.toString());
  }, [isAuthenticated]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onLogin={() => setIsAuthenticated(true)} />
            )
          }
        />

        <Route path="/" element={<DashboardLayout onLogout={handleLogout} />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              isAuthenticated ? (
                <UserDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="contacts"
            element={
              isAuthenticated ? (
                <ContactsManagement />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="templates"
            element={
              isAuthenticated ? (
                <MessageTemplates />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="send-message"
            element={
              isAuthenticated ? (
                <SendMessage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="schedule"
            element={
              isAuthenticated ? (
                <ScheduleMessage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="logs"
            element={
              isAuthenticated ? (
                <MessageLogs />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="admin"
            element={
              isAuthenticated ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="admin/users"
            element={
              isAuthenticated ? (
                <UserManagement />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="admin/api-config"
            element={
              isAuthenticated ? (
                <APIConfiguration />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="admin/system-logs"
            element={
              isAuthenticated ? (
                <SystemLogs />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
