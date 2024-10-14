import React, { useState, useEffect } from 'react';
import { Upload, Modal, Form, Input, Button, Checkbox, Layout, Divider, Table, Tooltip } from 'antd';
import { UploadOutlined, EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import Sidebar from '../../components/Sidebar';
import './DocumentManagement.css';

const { Header, Content } = Layout;

const initialDocuments = [
  { label: "Copy of Standard X certificate and mark sheets", key: "doc1" },
  { label: "Copy of Standard XI Certificate and mark sheets", key: "doc2" },
  { label: "Copy of Standard XII certificate and mark sheets", key: "doc3" },
  { label: "Copy of Degree Certificate(s) Graduate and Post Graduate", key: "doc4" },
  { label: "Copy of Mark Sheets of all Graduate/Post Graduate Programs", key: "doc5" },
  { label: "Copy of Consolidated Mark Sheet Graduate/Post Graduate Programs", key: "doc6" },
  { label: "Copy of any other Certifications/Course(s) attended", key: "doc7" },
  { label: "Copy of Passport/Passport application form", key: "doc8" },
];

const DocumentManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({ submittedBy: '', submittedTo: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editKey, setEditKey] = useState(null);

  useEffect(() => {
    const storedDocuments = JSON.parse(localStorage.getItem('dmsdb')) || [];
    setDocuments(storedDocuments);
  }, []);

  const openReceiveModal = (document = {}) => {
    setIsEditing(!!document.key);
    setFormData(document);
    setEditKey(document.key || null);
    setModalIsOpen(true);
  };

  const closeReceiveModal = () => {
    setModalIsOpen(false);
  };

  const handleFileChange = (key, { fileList }) => {
    const newFileData = fileList.length > 0 ? fileList[0].name : null;
    setFormData((prev) => ({
      ...prev,
      [key]: { ...prev[key], file: newFileData, confirmed: true } // Auto-check the checkbox on file upload
    }));
  };

  const handleCheckboxChange = (key, e) => {
    setFormData((prev) => ({
      ...prev,
      [key]: { ...prev[key], confirmed: e.target.checked }
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    let updatedDocuments;
    if (isEditing) {
      updatedDocuments = documents.map((doc) =>
        doc.key === editKey ? { ...doc, ...formData, updatedAt: new Date() } : doc
      );
    } else {
      const newDocument = { ...formData, createdAt: new Date(), updatedAt: new Date(), key: Date.now().toString() };
      updatedDocuments = [...documents, newDocument];
    }
    setDocuments(updatedDocuments);
    localStorage.setItem('dmsdb', JSON.stringify(updatedDocuments));
    closeReceiveModal();
  };

  const handleDelete = (key) => {
    const updatedDocuments = documents.filter((doc) => doc.key !== key);
    setDocuments(updatedDocuments);
    localStorage.setItem('dmsdb', JSON.stringify(updatedDocuments));
  };

  const handleApprove = (key) => {
    const updatedDocuments = documents.map((doc) => {
      if (doc.key === key) {
        return { ...doc, approved: true }; // Add an approval status
      }
      return doc;
    });
    setDocuments(updatedDocuments);
    localStorage.setItem('dmsdb', JSON.stringify(updatedDocuments));
  };

  const columns = [
    {
      title: 'Document',
      dataIndex: 'label',
    },
    {
      title: 'Files',
      dataIndex: 'files',
      render: (_, record) =>
        initialDocuments.map((doc) => (
          <div key={doc.key}>
            {formData[doc.key]?.file ? (
              <span>{formData[doc.key]?.file}</span>
            ) : (
              <span>No file uploaded</span>
            )}
          </div>
        )),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <>
          <Tooltip title="Edit">
            <Button type="primary" icon={<EditOutlined />} onClick={() => openReceiveModal(record)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button type="danger" icon={<DeleteOutlined />} onClick={() => handleDelete(record.key)} />
          </Tooltip>
          <Tooltip title="Approve">
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => handleApprove(record.key)}
              disabled={record.approved}
            >
              {record.approved ? "Approved" : "Approve"}
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];

  const isSubmitDisabled = initialDocuments.some(
    (doc) => !formData[doc.key]?.file || !formData[doc.key]?.confirmed
  );

  return (
    <div style={{ display: 'flex' }} className='main Document-management-page'>
      <Sidebar />
      <Layout style={{ backgroundColor: "#ffff" }}>
        <Header className="header">
          <h1 className="header-title">Document Management System</h1>
        </Header>
        <Divider />

        <Content className="document-management-container">
          <Button type="primary" onClick={() => openReceiveModal()}>
            Upload Document
          </Button>

          <Table
            columns={columns}
            dataSource={documents.map((doc) => ({
              ...doc,
              key: doc.key,
            }))}
            rowKey="key"
            className="document-table"
          />
        </Content>
      </Layout>

      {/* Modal for Upload Document */}
      <Modal title={isEditing ? "Edit Document" : "Receive Document"} visible={modalIsOpen} onCancel={closeReceiveModal} footer={null}>
        <Form onFinish={handleSubmit} layout="vertical">

          {/* Submitted By and Submitted To Fields */}
          <Form.Item label="Submitted By" required>
            <Input
              name="submittedBy"
              value={formData.submittedBy}
              onChange={handleInputChange}
              placeholder="Enter the submitter's name"
            />
          </Form.Item>

          <Form.Item label="Submitted To" required>
            <Input
              name="submittedTo"
              value={formData.submittedTo}
              onChange={handleInputChange}
              placeholder="Enter the recipient's name"
            />
          </Form.Item>

          {/* Document Upload Section */}
          {initialDocuments.map((doc) => (
            <Form.Item label={doc.label} key={doc.key}>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: "row" }}>
                <Upload
                  onChange={(info) => handleFileChange(doc.key, info)}
                  beforeUpload={() => false}
                  fileList={
                    formData[doc.key]?.file
                      ? [{ name: formData[doc.key].file, status: 'done' }]
                      : []
                  }
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
                <Checkbox
                  onChange={(e) => handleCheckboxChange(doc.key, e)}
                  checked={formData[doc.key]?.confirmed || false}
                  style={{ marginLeft: '10px' }}
                >
                  Confirm upload
                </Checkbox>
              </div>
            </Form.Item>
          ))}

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={isSubmitDisabled}>
              {isEditing ? "Update Document" : "Submit Document"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DocumentManagement;
