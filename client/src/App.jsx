import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Layout from './components/Layout';
import { ToastProvider } from './contexts/ToastContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Manifesto from './pages/Manifesto';
import Vote from './pages/Vote';
import Grievance from './pages/Grievance';
import Profile from './pages/Profile';
import ElectionStats from './pages/ElectionStats';

function App() {
  return (
    <Router>
      <ToastProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/manifesto" element={<Manifesto />} />
            <Route path="/stats" element={<ElectionStats />} />
            <Route path="/vote" element={<Vote />} />
            <Route path="/grievance" element={<Grievance />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </ToastProvider>
    </Router>
  );
}

export default App;
