import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Popconfirm, message, Tag, Row, Col, Divider, Typography, Layout } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import './AssetManagement.css'; // Import responsive styles
import Sidebar from '../../components/Sidebar';

const { Option } = Select;
const { Header, Content } = Layout;
const { Title } = Typography;

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

const AssetManagement = () => {
  const [assets, setAssets] = useState([]); // Store asset details
  const [filteredAssets, setFilteredAssets] = useState([]); // Store filtered asset details
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [form] = Form.useForm();

  // State to manage department and team selection
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [members, setMembers] = useState([]);

  const showAddModal = () => {
    setIsModalVisible(true);
    form.resetFields();
    setEditingAsset(null);
    setSelectedDepartment(null);
    setSelectedTeam(null);
    setMembers([]);
  };

  const handleOk = () => {
    form.validateFields()
      .then((values) => {
        if (editingAsset !== null) {
          setAssets((prev) => prev.map((asset) => (asset.key === editingAsset.key ? values : asset)));
          setFilteredAssets((prev) => prev.map((asset) => (asset.key === editingAsset.key ? values : asset)));
          message.success('Asset updated successfully!');
        } else {
          const newAsset = {
            ...values,
            key: assets.length + 1,
            status: 'received', // Default status to 'received'
          };
          setAssets((prev) => [...prev, newAsset]);
          setFilteredAssets((prev) => [...prev, newAsset]);
          message.success('Asset added successfully!');
        }
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log('Validation Failed:', info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleEdit = (record) => {
    setIsModalVisible(true);
    form.setFieldsValue(record);
    setEditingAsset(record);
    setSelectedDepartment(record.department);
    setSelectedTeam(record.team);
    setMembers(initialDepartments[record.department][record.team]);
  };

  const handleDelete = (key) => {
    setAssets((prev) => prev.filter((asset) => asset.key !== key));
    setFilteredAssets((prev) => prev.filter((asset) => asset.key !== key));
    message.success('Asset deleted successfully!');
  };

  const handleStatusChange = (key, status) => {
    setAssets((prev) => prev.map((asset) => (asset.key === key ? { ...asset, status } : asset)));
    setFilteredAssets((prev) => prev.map((asset) => (asset.key === key ? { ...asset, status } : asset)));
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = assets.filter(item =>
      item.name.toLowerCase().includes(value) ||
      item.employeeName.toLowerCase().includes(value) ||
      item.department.toLowerCase().includes(value)
    );
    setFilteredAssets(filtered);
  };

  // Handle department change to update teams
  const handleDepartmentChange = (value) => {
    setSelectedDepartment(value);
    setSelectedTeam(null);
    setMembers([]);
    form.setFieldsValue({ team: undefined, employeeName: undefined }); // Reset team and employee name
  };

  // Handle team change to update members
  const handleTeamChange = (value) => {
    setSelectedTeam(value);
    setMembers(initialDepartments[selectedDepartment][value]);
    form.setFieldsValue({ employeeName: undefined }); // Reset employee name
  };

  const columns = [
    {
      title: 'Asset Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Types',
      dataIndex: 'type',
      key: 'type',
      render: (types) => types.map((type, index) => <Tag key={index}>{type}</Tag>), // Show multiple types as tags
    },
    {
      title: 'Condition',
      dataIndex: 'condition',
      key: 'condition',
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Team',
      dataIndex: 'team',
      key: 'team',
    },
    {
      title: 'Project',
      dataIndex: 'project',
      key: 'project',
    },
    {
      title: 'Status',
      key: 'status',
      render: (record) => (
        record.status === 'received' ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>Received</Tag>
        ) : (
          <Tag color="red" icon={<CloseCircleOutlined />}>Not Returned</Tag>
        )
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <span>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record.key)}>
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
          <Button
            type="link"
            onClick={() => handleStatusChange(record.key, record.status === 'received' ? 'notReturned' : 'received')}
          >
            {record.status === 'received' ? 'Mark as Not Returned' : 'Mark as Received'}
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div className="asset-management-page">
      <Sidebar />
      <Header className="header">
        <h1 className="header-title">Asset Management</h1>
      </Header>
      <Divider />

      <Input  
        className='search-bar'
        placeholder="Search by Asset Name, Employee Name, or Department"
        onChange={handleSearch}
        style={{ marginBottom: '16px', marginRight:"10px"}}
      />

      <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
        Add Asset
      </Button>
      <Table
        columns={columns}
        dataSource={filteredAssets}
        rowKey="key"
        style={{ marginTop: 16 }}
        scroll={{ x: 768 }} // Enable horizontal scrolling
      />

      <Modal
        title={editingAsset ? 'Edit Asset' : 'Add Asset'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800} // Set the modal width to a reasonable value for responsiveness
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Asset Name"
                rules={[{ required: true, message: 'Please enter the asset name!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="type"
                label="Asset Types"
                rules={[{ required: true, message: 'Please select the asset types!' }]}
              >
                {/* Enable multiple selection for asset types */}
                <Select mode="multiple" placeholder="Select Asset Types">
                  <Option value="Laptop">Laptop</Option>
                  <Option value="Monitor">Monitor</Option>
                  <Option value="Keyboard">Keyboard</Option>
                  <Option value="Mouse">Mouse</Option>
                  <Option value="Phone">Phone</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="condition"
                label="Asset Condition"
                rules={[{ required: true, message: 'Please select the asset condition!' }]}
              >
                <Select>
                  <Option value="New">New</Option>
                  <Option value="Used">Used</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="department"
                label="Department"
                rules={[{ required: true, message: 'Please select the department!' }]}
              >
                <Select onChange={handleDepartmentChange} placeholder="Select Department">
                  {Object.keys(initialDepartments).map(department => (
                    <Option key={department} value={department}>{department}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="team"
                label="Team"
                rules={[{ required: true, message: 'Please select the team!' }]}
              >
                <Select onChange={handleTeamChange} disabled={!selectedDepartment} placeholder="Select Team">
                  {selectedDepartment && Object.keys(initialDepartments[selectedDepartment]).map(team => (
                    <Option key={team} value={team}>{team}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="employeeName"
                label="Employee Name"
                rules={[{ required: true, message: 'Please select the employee!' }]}
              >
                <Select disabled={!selectedTeam} placeholder="Select Employee">
                  {selectedTeam && members.map(member => (
                    <Option key={member.id} value={member.name}>{member.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="project"
                label="Project"
                rules={[{ required: true, message: 'Please enter the project name!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AssetManagement;
