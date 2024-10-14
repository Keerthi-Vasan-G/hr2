import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HomeOutlined, CalendarOutlined, FileTextOutlined, FormOutlined, InboxOutlined, DollarOutlined } from "@ant-design/icons";
import './MobileTab.css'; // CSS for mobile tab bar

const MobileTabBar = () => {
  const [activeTab, setActiveTab] = useState("home");
  const location = useLocation();

  const tabs = [
    { id: "home", icon: <HomeOutlined />, link: "/dashboard", label: "Home" },
    { id: "calendar", icon: <CalendarOutlined />, link: "/calendar", label: "Calendar" },
    { id: "document", icon: <FileTextOutlined />, link: "/document", label: "Documents" },
    { id: "leave", icon: <FormOutlined />, link: "/leave", label: "Leave" },
    { id: "assets", icon: <InboxOutlined />, link: "/assets", label: "Assets" },
    { id: "salary", icon: <DollarOutlined />, link: "/salary", label: "Salary" },
  ];

  return (
    <div className="mobile-tab-container">
      <nav className="mobile-tab-bar">
        {tabs.map((tab) => (
          <Link key={tab.id} to={tab.link} className={`mobile-tab-item ${location.pathname === tab.link ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            <div className="mobile-tab-icon">{tab.icon}</div>
            <div className="mobile-tab-label">{tab.label}</div>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default MobileTabBar;
