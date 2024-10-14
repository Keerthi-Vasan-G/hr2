import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Popconfirm, message, Tag, Row, Col, Divider, Typography, Layout } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import './AssetManagement.css'; // Import responsive styles
import Sidebar from '../../components/Sidebar';

const { Option } = Select;
const { Header, Content } = Layout;
const { Title } = Typography;

const AssetManagement = () => {
  const [assets, setAssets] = useState([]); // Store asset details
  const [filteredAssets, setFilteredAssets] = useState([]); // Store filtered asset details
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [form] = Form.useForm();

  const showAddModal = () => {
    setIsModalVisible(true);
    form.resetFields();
    setEditingAsset(null);
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

  const columns = [
    {
      title: 'Asset Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
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
                label="Asset Type"
                rules={[{ required: true, message: 'Please select the asset type!' }]}
              >
                <Select>
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
                label="Condition"
                rules={[{ required: true, message: 'Please enter the condition of the asset!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="employeeName"
                label="Employee Name"
                rules={[{ required: true, message: 'Please enter the employee name!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="department"
                label="Department"
                rules={[{ required: true, message: 'Please select the department!' }]}
              >
                <Select>
                  <Option value="HR">HR</Option>
                  <Option value="Engineering">Engineering</Option>
                  <Option value="Marketing">Marketing</Option>
                  <Option value="Sales">Sales</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="team"
                label="Team"
                rules={[{ required: true, message: 'Please enter the team name!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24}>
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
