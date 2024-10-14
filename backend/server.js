const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('./models/User');
const Property = require('./models/Property');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb://localhost:27017/house', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// User Registration
app.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ email, username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Forgot Password
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });

    const mailOptions = {
      to: user.email,
      from: 'passwordreset@yourapp.com',
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      http://localhost:3000/reset-password/${resetToken}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error sending email' });
      }
      res.status(200).json({ message: 'Password reset link sent to email' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset Password
app.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Post new property
app.post('/properties', upload.single('image'), async (req, res) => {
  const { title, price, location, rooms, bathrooms, nearby, description, contactEmail, contactNumber, postedBy, propertyType } = req.body;

  try {
    const newProperty = new Property({
      title,
      price,
      location,
      rooms,
      bathrooms,
      nearby,
      image: req.file.path,
      description,
      contactEmail,
      contactNumber,
      postedBy,
      propertyType,
    });

    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);
  } catch (error) {
    res.status(500).json({ message: 'Error creating property' });
  }
});

// Get properties with filters
app.get('/properties', async (req, res) => {
  const { rooms, bathrooms, maxPrice, location, nearby, propertyType } = req.query;

  try {
    const query = {};

    if (rooms) query.rooms = { $gte: rooms };
    if (bathrooms) query.bathrooms = { $gte: bathrooms };
    if (maxPrice) query.price = { $lte: maxPrice };
    if (location) query.location = new RegExp(location, 'i');
    if (nearby) query.nearby = new RegExp(nearby, 'i');
    if (propertyType) query.propertyType = propertyType;

    const properties = await Property.find(query);
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching properties' });
  }
});

// Update property by ID
app.patch('/properties/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  console.log('Received ID:', id);  // Debugging: Log the received ID

  const { title, price, location, rooms, bathrooms, nearby, description, contactEmail, contactNumber, propertyType } = req.body;

  try {
    const propertyData = {
      title,
      price,
      location,
      rooms,
      bathrooms,
      nearby,
      description,
      contactEmail,
      contactNumber,
      propertyType,
    };

    if (req.file) {
      propertyData.image = req.file.path;
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, propertyData, { new: true });
    if (!updatedProperty) {
      console.log('Property not found for ID:', id);  // Debugging: Log if property not found
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ message: 'Error updating property' });
  }
});

// Delete property by ID
app.delete('/properties/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProperty = await Property.findByIdAndDelete(id);
    if (!deletedProperty) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting property' });
  }
});

// Update user details
app.patch('/users/:email', async (req, res) => {
  const { email } = req.params;
  const { username, newEmail, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) user.username = username;
    if (newEmail) user.email = newEmail.toLowerCase();
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    res.status(200).json({ message: 'User details updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user details' });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
