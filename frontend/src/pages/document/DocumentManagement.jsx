import React, { useState, useEffect } from 'react';
import { Upload, Modal, Form, Button, Checkbox, Layout, Divider, Table, Tooltip, Input, message } from 'antd';
import { UploadOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
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
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({ employeeName: '', submittedBy: '', submittedTo: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editKey, setEditKey] = useState(null);

  // Load documents from localStorage on first load
  useEffect(() => {
    const storedDocuments = JSON.parse(localStorage.getItem('dmsdb')) || [];
    setDocuments(storedDocuments);
    setFilteredDocuments(storedDocuments);
  }, []);

  // Save documents to localStorage whenever the documents state is updated
  useEffect(() => {
    if (documents.length > 0) {
      localStorage.setItem('dmsdb', JSON.stringify(documents));
    }
  }, [documents]);

  // Handle search input change and filter documents
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = documents.filter((doc) =>
      initialDocuments.some((d) =>
        d.label.toLowerCase().includes(value) ||
        (formData[d.key]?.file || '').toLowerCase().includes(value)
      )
    );
    setFilteredDocuments(filtered);
  };

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
    setFilteredDocuments(updatedDocuments); // Update filtered documents
    closeReceiveModal();
  };

  const handleDelete = (key) => {
    const updatedDocuments = documents.filter((doc) => doc.key !== key);
    setDocuments(updatedDocuments);
    setFilteredDocuments(updatedDocuments); // Update filtered documents
    message.success('Document deleted successfully');
  };

  const columns = [
    {
      title: 'Document',
      dataIndex: 'label',
      render: (_, record) =>
        initialDocuments.map((doc) => (
          <div key={doc.key}>
            {doc.label}
          </div>
        )),
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
      title: 'Status',
      dataIndex: 'status',
      render: (_, record) => {
        const allFilesUploaded = initialDocuments.every((doc) => formData[doc.key]?.file);
        return allFilesUploaded ? 'Completed' : 'Pending';
      },
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
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <Button type="primary" onClick={() => openReceiveModal()}>
              Upload Document
            </Button>
            <Input
              placeholder="Search Documents"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
              style={{ width: '300px' }}
            />
          </div>

          <Table
            columns={columns}
            dataSource={filteredDocuments.map((doc) => ({
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
                  checked={formData[doc.key]?.confirmed || false}
                  style={{ marginLeft: '10px' }}
                  disabled // Disable checkbox to make it auto-check on file upload
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
