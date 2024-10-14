import React, { useState, useEffect } from 'react';
import { Table, Checkbox, Upload, message, Modal, Form, Input, Button, Tooltip, Layout, Divider, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import Sidebar from '../../components/Sidebar';
import './DocumentManagement.css';

const { Header, Content } = Layout;
const { Title } = Typography;

const DocumentManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [detailModalIsOpen, setDetailModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({ documentNumber: '', submittedBy: '', submittedTo: '', department: '', files: [] });
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedDocuments = JSON.parse(localStorage.getItem('dmsdb')) || [];
    setDocuments(storedDocuments);
  }, []);

  const openReceiveModal = () => {
    setModalIsOpen(true);
    setIsEditing(false); // Reset editing state
  };
  
  const closeReceiveModal = () => {
    setModalIsOpen(false);
    setFormData({ documentNumber: '', submittedBy: '', submittedTo: '', department: '', files: [] });
  };

  const openDetailModal = (document) => {
    setSelectedDocument(document);
    setDetailModalIsOpen(true);
  };

  const closeDetailModal = () => {
    setDetailModalIsOpen(false);
    setSelectedDocument(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = ({ fileList }) => {
    const files = fileList.map(file => ({ name: file.name, status: 'done' }));
    setFormData({ ...formData, files });
  };

  const handleSubmit = () => {
    let newDocuments = [...documents];
    
    if (isEditing) {
      newDocuments = newDocuments.map(doc => 
        doc.documentNumber === formData.documentNumber ? { ...formData, updatedAt: new Date() } : doc
      );
    } else {
      const existingDocIndex = newDocuments.findIndex(doc => doc.documentNumber === formData.documentNumber);

      if (existingDocIndex !== -1) {
        newDocuments[existingDocIndex].revision += 1; // Increment revision for existing document
        newDocuments[existingDocIndex].files = formData.files; // Update files
      } else {
        newDocuments.push({ ...formData, revision: 1, status: 'Received', createdAt: new Date(), updatedAt: new Date() });
      }
    }

    setDocuments(newDocuments);
    localStorage.setItem('dmsdb', JSON.stringify(newDocuments));
    closeReceiveModal();
  };

  const handleEdit = (document) => {
    setIsEditing(true);
    setFormData({ ...document });
    setModalIsOpen(true);
  };

  const handleDelete = (documentNumber) => {
    const newDocuments = documents.filter(doc => doc.documentNumber !== documentNumber);
    setDocuments(newDocuments);
    localStorage.setItem('dmsdb', JSON.stringify(newDocuments));
  };

  const columns = [
    {
      title: '',
      dataIndex: 'key',
      render: (text, record) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.documentNumber)}
          onChange={() => {
            const newSelectedKeys = selectedRowKeys.includes(record.documentNumber)
              ? selectedRowKeys.filter(key => key !== record.documentNumber)
              : [...selectedRowKeys, record.documentNumber];
            setSelectedRowKeys(newSelectedKeys);
          }}
        />
      ),
    },
    {
      title: 'Document No.',
      dataIndex: 'documentNumber',
      render: (text, record) => <a onClick={() => openDetailModal(record)}>{text}</a>,
    },
    {
      title: 'Revision',
      dataIndex: 'revision',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Submitted By',
      dataIndex: 'submittedBy',
    },
    {
      title: 'Submitted To',
      dataIndex: 'submittedTo',
    },
    {
      title: 'Department',
      dataIndex: 'department',
    },
    {
      title: 'Files',
      dataIndex: 'files',
      render: (files) => files.map(file => <div key={file.name}>{file.name}</div>),
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
      render: (text, record) => (
        <>
          <Tooltip title="Edit">
            <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button type="danger" icon={<DeleteOutlined />} onClick={() => handleDelete(record.documentNumber)} />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex' }} className='main Document-management-page'>
      <Sidebar />
      <Layout style={{ backgroundColor: "#ffff" }}>
        <Header className="header">
          <h1 className="header-title">Document Management System</h1>
        </Header>
        <Divider />

        <Content className="document-management-container">
          <Button type="primary" icon={<PlusOutlined />} onClick={openReceiveModal}>
            Receive Document
          </Button>
          <input type="search" className="animated" placeholder="Search Document No." style={{ marginLeft: '20px' }} />

          <div className="table-responsive">
            <Table
              columns={columns}
              dataSource={documents.map((doc, index) => ({ ...doc, key: index }))}
              rowKey="documentNumber" 
            />
          </div>
        </Content>
      </Layout>

      {/* Receive Document Modal */}
      <Modal title={isEditing ? "Edit Document" : "Receive Document"} visible={modalIsOpen} onCancel={closeReceiveModal} footer={null}>
        <Form onFinish={handleSubmit} layout="vertical">
          <Form.Item label="Document No." required>
            <Input name="documentNumber" value={formData.documentNumber} onChange={handleInputChange} disabled={isEditing} />
          </Form.Item>
          <Form.Item label="Submitted By" required>
            <Input name="submittedBy" value={formData.submittedBy} onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Submitted To" required>
            <Input name="submittedTo" value={formData.submittedTo} onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Department" required>
            <Input name="department" value={formData.department} onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Upload Files">
            <Upload
              multiple
              beforeUpload={() => false} // Prevent automatic upload
              onChange={handleFileChange}
              fileList={formData.files}
            >
              <Button>Upload Files</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditing ? "Update Document" : "Submit Document"}
            </Button>
            <Button style={{ marginLeft: '10px' }} onClick={closeReceiveModal}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Document Detail Modal */}
      {selectedDocument && (
        <Modal title="Document Details" visible={detailModalIsOpen} onCancel={closeDetailModal} footer={null}>
          <p><strong>Document No:</strong> {selectedDocument.documentNumber}</p>
          <p><strong>Revision:</strong> {selectedDocument.revision}</p>
          <p><strong>Status:</strong> {selectedDocument.status}</p>
          <p><strong>Submitted By:</strong> {selectedDocument.submittedBy}</p>
          <p><strong>Submitted To:</strong> {selectedDocument.submittedTo}</p>
          <p><strong>Department:</strong> {selectedDocument.department}</p>
          <p><strong>Files:</strong></p>
          <ul>
            {selectedDocument.files.map(file => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
          <p><strong>Created At:</strong> {new Date(selectedDocument.createdAt).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(selectedDocument.updatedAt).toLocaleString()}</p>
        </Modal>
      )}
    </div>
  );
};

export default DocumentManagement;
