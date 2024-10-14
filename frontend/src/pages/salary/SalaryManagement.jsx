import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message, Row, Col, Select, Tag, Typography, Layout, Divider } from 'antd';
import { UploadOutlined, FilePdfOutlined, PrinterOutlined, PlusOutlined } from '@ant-design/icons';
import Sidebar from '../../components/Sidebar';
import './SalaryManagement.css'; // Create the CSS file for styling
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const { Title } = Typography;
const { Option } = Select;
const { Header, Content } = Layout;

const SalaryManagement = () => {
  const [salaryData, setSalaryData] = useState([]); // Store salary details
  const [filteredData, setFilteredData] = useState([]); // Store filtered salary details
  const [isModalVisible, setIsModalVisible] = useState(false); // For modal visibility
  const [form] = Form.useForm();

  // Upload file logic
  const uploadProps = {
    beforeUpload: (file) => {
      message.success(`${file.name} file uploaded successfully.`);
      return false; // Prevent upload to server
    },
  };

  const showAddModal = () => {
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      // Calculate net salary after deducting advance payment
      const adjustedNetSalary = values.advancePayment
        ? values.netSalary - values.advancePayment
        : values.netSalary;

      const newSalary = {
        ...values,
        key: salaryData.length + 1,
        status: values.status || 'Paid',
        adjustedNetSalary: adjustedNetSalary, // Store the adjusted net salary after advance deduction
      };

      setSalaryData((prev) => [...prev, newSalary]);
      setFilteredData([...salaryData, newSalary]);
      message.success('Salary record added successfully!');
      setIsModalVisible(false);
    }).catch((info) => {
      console.log('Validation Failed:', info);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const generatePDF = (record) => {
    const doc = new jsPDF();
    doc.text("Salary Details", 20, 10);
    autoTable(doc, {
      startY: 20,
      head: [['Field', 'Value']],
      body: [
        ['Employee Name', record.employeeName],
        ['Department', record.department],
        ['Total Days Worked', record.daysWorked],
        ['Total Leave Days', record.leaveDays],
        ['Advance Payment', record.advancePayment || 'None'],
        ['Net Salary (After Advance)', record.adjustedNetSalary],
        ['Status', record.status]
      ]
    });
    doc.save(`${record.employeeName}_salary.pdf`);
  };

  const handlePrint = (record) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
      <head>
        <title>Salary Details</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          table, th, td { border: 1px solid black; }
          th, td { padding: 10px; text-align: left; }
        </style>
      </head>
      <body>
        <h1>Salary Details</h1>
        <table>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
          <tr>
            <td>Employee Name</td>
            <td>${record.employeeName}</td>
          </tr>
          <tr>
            <td>Department</td>
            <td>${record.department}</td>
          </tr>
          <tr>
            <td>Total Days Worked</td>
            <td>${record.daysWorked}</td>
          </tr>
          <tr>
            <td>Total Leave Days</td>
            <td>${record.leaveDays}</td>
          </tr>
          <tr>
            <td>Advance Payment</td>
            <td>${record.advancePayment || 'None'}</td>
          </tr>
          <tr>
            <td>Net Salary (After Advance)</td>
            <td>${record.adjustedNetSalary}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>${record.status}</td>
          </tr>
        </table>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const columns = [
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
      title: 'Total Days Worked',
      dataIndex: 'daysWorked',
      key: 'daysWorked',
    },
    {
      title: 'Total Leave Days',
      dataIndex: 'leaveDays',
      key: 'leaveDays',
    },
    {
      title: 'Advance Payment',
      dataIndex: 'advancePayment',
      key: 'advancePayment',
      render: (advance) => (advance ? `₹${advance}` : 'None')
    },
    {
      title: 'Net Salary (After Advance)',
      dataIndex: 'adjustedNetSalary',
      key: 'adjustedNetSalary',
      render: (salary) => `₹${salary}`
    },
    {
      title: 'Status',
      key: 'status',
      render: (record) => (
        <Tag color={record.status === 'Paid' ? 'green' : 'volcano'}>
          {record.status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record) => (
        <>
          <Button type="link" icon={<FilePdfOutlined />} onClick={() => generatePDF(record)}>
            Download PDF
          </Button>
          <Button type="link" icon={<PrinterOutlined />} onClick={() => handlePrint(record)}>
            Print
          </Button>
        </>
      ),
    },
  ];

  // Real-time filter logic
  const handleSearch = (e) => {
    const { value } = e.target;
    const filtered = salaryData.filter(item =>
      item.employeeName.toLowerCase().includes(value.toLowerCase()) ||
      item.department.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <div className="salary-management-page main">
      <Sidebar />
      <Layout style={{backgroundColor:"#ffff"}}>
        <Header className="header">
          <h1 className="header-title">Salary Management</h1>
          <Divider />
        </Header>
        <Content style={{ margin: '16px' }}>
          {/* Search Filter */}
          <Input
            placeholder="Search by Employee Name or Department"
            onChange={handleSearch}
            style={{ marginBottom: '16px',width:"250px" }}
          />
          <br />
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
            Add Salary Record
          </Button>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />} style={{ marginLeft: '10px' }}>Upload Monthly Attendance</Button>
          </Upload>
          <Table columns={columns} dataSource={filteredData} rowKey="key" style={{ marginTop: 16 }} />

          <Modal
            title="Add Salary Record"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="employeeName"
                    label="Employee Name"
                    rules={[{ required: true, message: 'Please enter the employee name!' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
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
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="daysWorked"
                    label="Total Days Worked"
                    rules={[{ required: true, message: 'Please enter total days worked!' }]}
                  >
                    <Input type="number" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="leaveDays"
                    label="Total Leave Days"
                    rules={[{ required: true, message: 'Please enter total leave days!' }]}
                  >
                    <Input type="number" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="netSalary"
                    label="Net Salary"
                    rules={[{ required: true, message: 'Please enter the net salary!' }]}
                  >
                    <Input type="number" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="advancePayment"
                    label="Advance Payment"
                    rules={[{ required: false, message: 'Please enter the advance payment!' }]}
                  >
                    <Input type="number" placeholder="0" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="status" label="Status">
                <Select>
                  <Option value="Paid">Paid</Option>
                  <Option value="Pending">Pending</Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </div>
  );
};

export default SalaryManagement;
