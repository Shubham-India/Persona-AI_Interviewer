import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/common/protectedRoute.jsx';
import UserLoginPage from './pages/login.jsx';
import Dashboard from './pages/dashboard.jsx';
import ResultPage from './pages/results.jsx';
import InterviewSession from './pages/interviewsession.jsx';

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<UserLoginPage />} />
      <Route path="/login" element={<Navigate to="/" />} />

      {/* Protected Routes: Sirf login users ke liye */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="/interview/:interviewId" element={
        <ProtectedRoute>
          <InterviewSession />
        </ProtectedRoute>
      } />

      <Route path="/results" element={
        <ProtectedRoute>
          <ResultPage />
        </ProtectedRoute>
      } />

      {/* 404 - Redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;