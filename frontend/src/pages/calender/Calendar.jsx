import React, { useState } from "react";
import { Layout, Calendar, Modal, Input, Button, List, Typography, Divider } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from '../../components/Sidebar';
import './CalendarComponent.css'; // Import the custom CSS file

const { Title } = Typography;
const { Header, Content } = Layout; // Use Layout components from antd

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingEventIndex, setEditingEventIndex] = useState(null); // Track which event is being edited

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setOpenModal(true);
    setEditingEventIndex(null); // Reset editing mode
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewEventTitle("");
  };

  const handleAddEvent = () => {
    if (newEventTitle) {
      if (editingEventIndex !== null) {
        // Edit existing event
        const updatedEvents = [...events];
        updatedEvents[editingEventIndex] = {
          ...updatedEvents[editingEventIndex],
          title: newEventTitle,
        };
        setEvents(updatedEvents);
        toast.success(`Event '${newEventTitle}' updated successfully!`);
      } else {
        // Add new event
        const newEvent = {
          title: newEventTitle,
          date: selectedDate.format("YYYY-MM-DD"),
        };
        setEvents([...events, newEvent]);
        toast.success(`Event '${newEventTitle}' added successfully!`);
      }
      handleCloseModal();
    } else {
      toast.error("Event title cannot be empty!");
    }
  };

  const handleEditEvent = (index) => {
    const eventToEdit = events[index];
    setNewEventTitle(eventToEdit.title);
    setSelectedDate(eventToEdit.date);
    setEditingEventIndex(index); // Set the index of the event being edited
    setOpenModal(true); // Open the modal for editing
  };

  const handleDeleteEvent = (index) => {
    const updatedEvents = events.filter((_, i) => i !== index);
    setEvents(updatedEvents);
    toast.success("Event deleted successfully!");
  };

  const eventList = events.map((event, index) => (
    <List.Item
      key={index}
      actions={[
        <Button type="link" onClick={() => handleEditEvent(index)} key="edit">Edit</Button>,
        <Button type="link" danger onClick={() => handleDeleteEvent(index)} key="delete">Delete</Button>,
      ]}
    >
      <List.Item.Meta title={event.title} description={event.date} />
    </List.Item>
  ));

  return (
    <div className="main"><Layout style={{ minHeight: "100vh" }}>
    <Sidebar /> {/* Render Sidebar component */}

    <Layout>
      <Header className="header">
        <h1 className="header-title">Calendar</h1>

      </Header>
      <div className="divider">
      <Divider/>

      </div>

      <Content className="content">
        <div className="calendar-event-container ">
          {/* Left side: Calendar */}
          <div className="calendar-container">
            <Calendar
              onSelect={handleDateSelect}
              dateCellRender={(date) => {
                const dateEvents = events.filter(
                  (event) => event.date === date.format("YYYY-MM-DD")
                );
                return (
                  <div>
                    {dateEvents.map((event, index) => (
                      <div key={index} className="event-title">{event.title}</div>
                    ))}
                  </div>
                );
              }}
            />
          </div>

          {/* Right side: Event list */}
          <div className="event-list-container">
            <Title level={5} className="event-list-title">Events</Title>
            <List>{eventList}</List>
          </div>
        </div>

        <ToastContainer />

        {/* Event Modal */}
        <Modal
          title={editingEventIndex !== null ? "Edit Event" : "Add Event"}
          visible={openModal}
          onCancel={handleCloseModal}
          footer={[
            <Button key="cancel" onClick={handleCloseModal} className="modal-button">
              Cancel
            </Button>,
            <Button key="add" type="primary" onClick={handleAddEvent} className="modal-button">
              {editingEventIndex !== null ? "Update" : "Add"}
            </Button>,
          ]}
        >
          <p>Please enter a title for your event.</p>
          <Input
            autoFocus
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
            placeholder="Event Title"
          />
        </Modal>
      </Content>
    </Layout>
  </Layout></div>
    
  );
};

export default CalendarComponent;
