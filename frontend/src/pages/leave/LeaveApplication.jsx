  import React, { useState } from "react";
  import {
    Form,
    Select,
    DatePicker,
    Input,
    Button,
    Steps,
    notification,
    Modal,
    List,
    Card,
    Col,
    Row,
    Layout,
    Typography,
    Divider,
  } from "antd";
  import Sidebar from "../../components/Sidebar";

  const { Option } = Select;
  const { Step } = Steps;
  const { Header, Content } = Layout;
  const { Title } = Typography;

  const LeaveApplication = () => {
    const initialLeaveBalance = 21;
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const [status, setStatus] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [leaveHistory, setLeaveHistory] = useState([]);
    const [totalLeavesUsed, setTotalLeavesUsed] = useState(0);
    const [filter, setFilter] = useState("");
    const [currentStatus, setCurrentStatus] = useState("Team Lead Review");

    const culturalLeaveReasons = [
      "Festivals",
      "Cultural Events",
      "Family Functions",
      "Religious Observances",
      "Traditional Ceremonies",
    ];

    const remainingLeaves = initialLeaveBalance - totalLeavesUsed;

    const validateEndDate = (_, value) => {
      if (!value || !form.getFieldValue("startDate")) {
        return Promise.resolve();
      }
      return value.isBefore(form.getFieldValue("startDate"))
        ? Promise.reject(new Error("End date must be after start date!"))
        : Promise.resolve();
    };

    const onFinish = (values) => {
      const startDate = values.startDate.valueOf();
      const endDate = values.endDate.valueOf();
      const leaveDays = Math.ceil((endDate - startDate) / (1000 * 3600 * 24)) + 1;

      if (totalLeavesUsed + leaveDays > initialLeaveBalance) {
        notification.warning({
          message: "Leave Limit Exceeded",
          description: `You have exceeded the allowed leave limit of 21 days. Your leave will be marked as unpaid.`,
        });
        values.leaveType = "unpaid";
      }

      setCurrent(1);
      notification.success({
        message: "Leave Application Submitted",
        description: "Your leave application is under review by the team lead.",
      });

      setTimeout(() => {
        const isApprovedByTeamLead = Math.random() > 0.5;
        setStatus(isApprovedByTeamLead ? "HR Review" : "Rejected");
        setCurrentStatus(isApprovedByTeamLead ? "HR Review" : "Rejected");
        setCurrent(2);
        setIsModalVisible(true);

        if (isApprovedByTeamLead) {
          setTimeout(() => {
            const isApprovedByHR = Math.random() > 0.5;
            setStatus(isApprovedByHR ? "Manager Review" : "Rejected");
            setCurrentStatus(isApprovedByHR ? "Manager Review" : "Rejected");

            if (isApprovedByHR) {
              setTimeout(() => {
                const isApprovedByManager = Math.random() > 0.5;
                setStatus(isApprovedByManager ? "Approved" : "Rejected");
                setCurrentStatus(isApprovedByManager ? "Approved" : "Rejected");

                if (isApprovedByManager) {
                  setTotalLeavesUsed((prev) => prev + leaveDays);
                  notification.success({
                    message: "Leave Application Approved",
                    description: `Your leave application has been approved by the manager.`,
                  });
                } else {
                  notification.error({
                    message: "Leave Application Rejected",
                    description: "Your leave application has been rejected by the manager.",
                  });
                }
              }, 3000);
            } else {
              notification.error({
                message: "Leave Application Rejected",
                description: "Your leave application has been rejected by HR.",
              });
            }
          }, 3000);
        } else {
          notification.error({
            message: "Leave Application Rejected",
            description: "Your leave application has been rejected by the team lead.",
          });
        }

        setLeaveHistory((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            ...values,
            status: currentStatus,
            date: new Date().toLocaleDateString(),
          },
        ]);
      }, 3000);
    };

    const handleModalClose = () => {
      setIsModalVisible(false);
    };

    const filteredLeaveHistory = leaveHistory.filter((item) =>
      item.status.toLowerCase().includes(filter.toLowerCase())
    );

    const leaveMessage = (leaveDays) => {
      const remainingLeaveDays = remainingLeaves - leaveDays;
      return remainingLeaveDays >= 0
        ? `You now have ${remainingLeaveDays} leave days remaining.`
        : `You have used all your paid leave days. Additional leave will be unpaid.`;
    };

    const handleCheckStatus = (item) => {
      setCurrentStatus(item.status);
      setCurrent(
        item.status === "Approved"
          ? 3
          : item.status === "Manager Review"
          ? 2
          : item.status === "HR Review"
          ? 1
          : 0
      );
      setIsModalVisible(true);
    };

    return (
      <div className="main">
        <Layout style={{ minHeight: "100vh" ,backgroundColor: "#ffffff"  }}>
          <Sidebar />
          <Layout style={{ minHeight: "100vh" }}>
  <Sidebar />
  <Layout style={{ backgroundColor: "#ffffff" }}>
    <Header className="header">
      <h1 className="header-title">Leave Management System</h1>
      <Divider />
    </Header>

    <Content style={{ margin: "16px" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          <Card title="Leave Application Form">
            <Steps current={current}>
              <Step title="Team Lead Review" />
              <Step title="HR Review" />
              <Step title="Manager Decision" />
              <Step title="Final Approval" />
            </Steps>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="employeeId"
                    label="Employee ID"
                    rules={[{ required: true, message: "Please input your Employee ID!" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="employeeName"
                    label="Employee Name"
                    rules={[{ required: true, message: "Please input your name!" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="leaveType"
                label="Leave Type"
                rules={[{ required: true, message: "Please select leave type!" }]}
              >
                <Select placeholder="Select leave type">
                  <Option value="marriage">Marriage Leave</Option>
                  <Option value="casual">Casual Leave</Option>
                  <Option value="maternity">Maternity Leave</Option>
                  <Option value="sick">Sick Leave</Option>
                  <Option value="paid">Paid Leave</Option>
                  <Option value="half">Half Day Leave</Option>
                  <Option value="compensatory">Compensatory Leave</Option>
                  <Option value="unpaid">Unpaid Leave</Option>
                </Select>
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="startDate"
                    label="Start Date"
                    rules={[{ required: true, message: "Please select start date!" }]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="endDate"
                    label="End Date"
                    rules={[{ required: true, message: "Please select end date!" }, { validator: validateEndDate }]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="reason"
                label="Reason for Leave"
                rules={[{ required: true, message: "Please provide a reason!" }]}
              >
                <Select placeholder="Select reason for leave">
                  {culturalLeaveReasons.map((reason) => (
                    <Option key={reason} value={reason}>{reason}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Button type="primary" htmlType="submit" style={{ alignSelf: "center" }}>Submit</Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="Leave Policy" style={{ maxHeight: "300px", overflowY: "auto" }}>
            <p>You are entitled to 21 paid leave days per year. Once these days are used, any additional leave will be marked as unpaid.</p>
            <p>Total Paid Leave Balance: {remainingLeaves} days</p>
            <p>Total Leaves Used: {totalLeavesUsed} days</p>
          </Card>

          <Card title="Leave History" style={{ marginTop: 16 }}>
            <Input.Search
              placeholder="Filter by status"
              onSearch={(value) => setFilter(value)}
              style={{ marginBottom: 16 }}
            />
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              <List
                itemLayout="horizontal"
                dataSource={filteredLeaveHistory}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button type="link" onClick={() => handleCheckStatus(item)}>Check Status</Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={`Leave ID: ${item.id}`}
                      description={`Name: ${item.employeeName}, Type: ${item.leaveType}, From: ${item.startDate?.format("YYYY-MM-DD")} To: ${item.endDate?.format("YYYY-MM-DD")}, Reason: ${item.reason}, Status: ${item.status}, Date Submitted: ${item.date}`}
                    />
                  </List.Item>
                )}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </Content>
  </Layout>
</Layout>

        </Layout>
      </div>
    );
  };

  export default LeaveApplication;
