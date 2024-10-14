import React from 'react';
import { Layout, Menu, Tooltip } from 'antd';
import { HomeOutlined, CalendarOutlined, FileTextOutlined, FormOutlined, LogoutOutlined, InboxOutlined, DollarOutlined } from '@ant-design/icons'; // DollarOutlined for Salary Management
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css'; // Import the CSS file for the sidebar styles
import logo from '../assets/images/logo.png';

const { Sider } = Layout;

// Define the menu items including Leave Application, Asset Management, and Salary Management
const menuItems = [
    { key: '1', text: "Dashboard", icon: <HomeOutlined />, link: "/dashboard" },
    { key: '2', text: "Calendar", icon: <CalendarOutlined />, link: "/calendar" },
    { key: '3', text: "Document", icon: <FileTextOutlined />, link: "/document" },
    { key: '4', text: "Leave Application", icon: <FormOutlined />, link: "/leave" },
    { key: '5', text: "Asset Management", icon: <InboxOutlined />, link: "/assets" }, 
    { key: '6', text: "Salary Management", icon: <DollarOutlined />, link: "/salary" }, // New Salary Management menu item
];

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location

    const currentPath = location.pathname;

    return (
        <Sider className="sidebar" theme="light" width={80}> {/* Adjusted width */} 
            <LogoSection />
            <MenuSection items={menuItems} navigate={navigate} currentPath={currentPath} />
            <LogoutSection navigate={navigate} />
        </Sider>
    );
};

const LogoSection = () => (
    <div className="logo-section">
        <img src={logo} alt="Logo" className="logo" />
    </div>
);

const MenuSection = ({ items, navigate, currentPath }) => (
    <Menu
        mode="inline"
        selectedKeys={[items.find(item => item.link === currentPath)?.key]} // Set selected key based on current path
        className="menu-section"
        theme="light"
    >
        {items.map(item => (
            <Menu.Item
                key={item.key}
                onClick={() => navigate(item.link)}
            >
                <Tooltip title={item.text} placement="right">
                    {item.icon}
                </Tooltip>
            </Menu.Item>
        ))}
    </Menu>
);

const LogoutSection = ({ navigate }) => {
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        navigate('/');
    };

    return (
        <div className="logout-section" onClick={handleLogout}>
            <Tooltip title="Logout" placement="right">
                <LogoutOutlined className="logout-icon" />
            </Tooltip>
        </div>
    );
};

export default Sidebar;
