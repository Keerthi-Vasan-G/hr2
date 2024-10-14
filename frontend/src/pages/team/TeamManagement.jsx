import React, { useState } from "react";

import { Button, Input, List, notification, Select, Modal,Divider } from "antd";
import "./TeamManagement.css"
import Sidebar from '../../components/Sidebar';

const initialDepartments = {
  Development: {
    TeamA: [
      { id: 1, name: "John Doe", role: "leader" },
      { id: 2, name: "Jane Smith", role: "member" },
    ],
    TeamB: [
      { id: 1, name: "Alice Green", role: "leader" },
      { id: 2, name: "Bob Brown", role: "member" },
    ],
  },
  Marketing: {
    TeamC: [
      { id: 1, name: "Eve White", role: "leader" },
      { id: 2, name: "Charlie Black", role: "member" },
    ],
  },
  HR: {
    TeamD: [
      { id: 1, name: "Mike Blue", role: "leader" },
      { id: 2, name: "Sara Yellow", role: "member" },
    ],
  },
};

const TeamManagement = () => {
  const [departments, setDepartments] = useState(initialDepartments);
  const [selectedDepartment, setSelectedDepartment] = useState("Development");
  const [selectedTeam, setSelectedTeam] = useState("TeamA");
  const [newMemberName, setNewMemberName] = useState("");
  const [editingMember, setEditingMember] = useState(null);

  const teamOptions = Object.keys(departments[selectedDepartment]);

  const addMember = () => {
    const teamMembers = departments[selectedDepartment][selectedTeam];
    const existingMember = teamMembers.find(
      (member) => member.name.toLowerCase() === newMemberName.toLowerCase()
    );

    if (existingMember) {
      notification.warning({
        message: "Member Already Exists",
        description: `${newMemberName} is already part of ${selectedTeam}.`,
      });
    } else {
      const newMember = { id: teamMembers.length + 1, name: newMemberName, role: "member" };
      setDepartments((prevDepartments) => ({
        ...prevDepartments,
        [selectedDepartment]: {
          ...prevDepartments[selectedDepartment],
          [selectedTeam]: [...teamMembers, newMember],
        },
      }));

      notification.success({
        message: "New Member Added",
        description: `${newMemberName} has been added to ${selectedTeam}.`,
      });

      setNewMemberName("");
    }
  };

  const editMember = (member) => setEditingMember(member);

  const updateMember = () => {
    const updatedMembers = departments[selectedDepartment][selectedTeam].map((member) =>
      member.id === editingMember.id
        ? { ...member, name: editingMember.name, role: editingMember.role }
        : member
    );

    setDepartments((prevDepartments) => ({
      ...prevDepartments,
      [selectedDepartment]: {
        ...prevDepartments[selectedDepartment],
        [selectedTeam]: updatedMembers,
      },
    }));

    notification.success({
      message: "Member Updated",
      description: `${editingMember.name}'s information has been updated.`,
    });
    setEditingMember(null);
  };

  return (
    <div className="main">
        <Sidebar />
       
        <div className="container">
             <div className="team-head">
        <h1 className="header-title">HR Dashboard</h1>
        <Divider /> 
        </div>
      <div className="flex-container">
        {/* Left Side - Team Selection */}
        <div className="left-panel">
          {/* Select Department */}
          <Select
            defaultValue={selectedDepartment}
            style={{ width: "100%", marginBottom: "20px" }}
            onChange={(value) => {
              setSelectedDepartment(value);
              setSelectedTeam(Object.keys(departments[value])[0]); // Reset team selection
            }}
          >
            {Object.keys(departments).map((department) => (
              <Select.Option key={department} value={department}>
                {department}
              </Select.Option>
            ))}
          </Select>

          {/* Select Team */}
          <Select
            defaultValue={selectedTeam}
            style={{ width: "100%", marginBottom: "20px" }}
            onChange={setSelectedTeam}
          >
            {teamOptions.map((team) => (
              <Select.Option key={team} value={team}>
                {team}
              </Select.Option>
            ))}
          </Select>

          {/* Input to Add New Member */}
          <div className="input-container">
            <Input
              placeholder="Enter new member name"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              style={{ flex: 1 }} // Allow the input to grow
            />
            <Button type="primary" onClick={addMember}>
              Add Member
            </Button>
          </div>
        </div>

        {/* Right Side - Team Members List */}
        <div className="right-panel">
          {/* List of Team Members */}
          <List
            header={<div>{selectedTeam} Members</div>}
            bordered
            dataSource={departments[selectedDepartment][selectedTeam]}
            renderItem={(item) => (
              <List.Item
                actions={[<Button type="link" onClick={() => editMember(item)}>Edit</Button>]}
              >
                {item.name} ({item.role})
              </List.Item>
            )}
            style={{ marginBottom: "20px" }}
          />

          {/* New Section for Additional Information */}
          <div className="additional-info">
            <h3>Additional Information</h3>
            <p>
              Here you can display more information about the selected team,
              such as statistics, roles, or any other relevant details.
            </p>
            {/* You can add more content or components here as needed */}
          </div>
        </div>
      </div>

      {/* Modal for Editing a Member */}
      {editingMember && (
        <Modal
          title="Edit Member"
          visible={!!editingMember}
          onCancel={() => setEditingMember(null)}
          onOk={updateMember}
        >
          <Input
            value={editingMember.name}
            onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
            style={{ marginBottom: "10px" }}
          />
          <Select
            value={editingMember.role}
            style={{ width: "100%" }}
            onChange={(value) => setEditingMember({ ...editingMember, role: value })}
          >
            <Select.Option value="leader">Leader</Select.Option>
            <Select.Option value="member">Member</Select.Option>
          </Select>
        </Modal>
      )}
    </div>
    </div>

    
  );
};

export default TeamManagement;
