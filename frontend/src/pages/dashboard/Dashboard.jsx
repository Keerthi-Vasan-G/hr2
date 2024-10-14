import React from 'react';
import { Divider, message } from 'antd';
import { UserOutlined, FileDoneOutlined, TeamOutlined } from '@ant-design/icons'; // HR-related icons
import Sidebar from '../../components/Sidebar';
import './Dashboard.css'; // Import the CSS file

const Dashboard = () => {

  const handleSubmit = (values) => {
    console.log(values); // Handle form submission (e.g., send data to an API or server)
    message.success('Form submitted successfully!');
  };

  return (
    <div className="main"> 
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          {/* HEADER */}
          <h1 className="header-title">HR Dashboard</h1>
          <Divider /> {/* Divider added here */}

          {/* GRID & CHARTS */}
          <div className="dashboard-row">
            {/* ROW 1 */}
            <div className="dashboard-card">
              <UserOutlined className="dashboard-icon" />
              <h3 className="dashboard-stat-title">156</h3>
              <p className="dashboard-stat-subtitle">New Employees</p>
              <p className="dashboard-stat-increase">+12%</p>
            </div>
            <div className="dashboard-card">
              <FileDoneOutlined className="dashboard-icon" />
              <h3 className="dashboard-stat-title">98</h3>
              <p className="dashboard-stat-subtitle">Pending Approvals</p>
              <p className="dashboard-stat-increase">-8%</p>
            </div>
            <div className="dashboard-card">
              <TeamOutlined className="dashboard-icon" />
              <h3 className="dashboard-stat-title">4,521</h3>
              <p className="dashboard-stat-subtitle">Total Employees</p>
              <p className="dashboard-stat-increase">+5%</p>
            </div>
          </div>
        {/* ROW 2 */}

          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
