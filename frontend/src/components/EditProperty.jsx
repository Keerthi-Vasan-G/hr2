import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios'; // Assuming axios is being used

const EditProperty = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { property, user } = location.state || {};

  const [formData, setFormData] = useState({
    title: property.title,
    price: property.price,
    location: property.location,
    rooms: property.rooms,
    bathrooms: property.bathrooms,
    nearby: property.nearby,
    description: property.description,
    contactNumber: property.contactNumber,
    propertyType: property.propertyType,
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpdateProperty = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (image) {
      data.append('image', image);
    }

    try {
      const response = await axios.patch(`http://localhost:5000/properties/${property._id}/${user.email}`, data);
      toast.success('Property updated successfully.');
      navigate('/userdetails', { state: { user } });
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Error updating property.');
    }
  };

  return (
    <div className="edit-property-page">
      <h2>Edit Property</h2>
      <form onSubmit={handleUpdateProperty}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Property Title"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          required
        />
        <select name="propertyType" value={formData.propertyType} onChange={handleChange} required>
          <option value="Villa">Villa</option>
          <option value="Flat">Flat</option>
          <option value="Land">Land</option>
          <option value="Mobile Home">Mobile Home</option>
          <option value="Bungalow">Bungalow</option>
          <option value="Condo">Condo</option>
          <option value="Penthouse">Penthouse</option>
          <option value="Watch">Watch</option>
        </select>
        <input
          type="number"
          name="rooms"
          value={formData.rooms}
          onChange={handleChange}
          placeholder="Rooms"
          required
        />
        <input
          type="number"
          name="bathrooms"
          value={formData.bathrooms}
          onChange={handleChange}
          placeholder="Bathrooms"
          required
        />
        <input
          type="text"
          name="nearby"
          value={formData.nearby}
          onChange={handleChange}
          placeholder="Nearby Features"
          required
        />
        <input
          type="text"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          placeholder="Contact Number"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
        ></textarea>
        <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Update Property</button>
      </form>
    </div>
  );
};

export default EditProperty;
