import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Importing components and pages
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './pages/dashboard/Dashboard';
import Calendar from './pages/calender/Calendar';
import DocumentManagement from './pages/document/DocumentManagement';
import LeaveApplication from './pages/leave/LeaveApplication';
import AssetManagement from './pages/assetsmanage/AssetManagement';
import SalaryManagement from './pages/salary/SalaryManagement';
import TeamManagement from './pages/team/TeamManagement';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/document" element={<DocumentManagement />} />
        <Route path="/leave" element={<LeaveApplication />} />
        <Route path="/assets" element={<AssetManagement />} />
        <Route path="/salary" element={<SalaryManagement />} />
        <Route path="/team" element={<TeamManagement />} />

      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </Router>
  );
};

export default App;
