// routes/volunteer.js
const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteers');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
require('dotenv').config(); 
const secretKey = process.env.SECRET_KEY;

const authenticateJWT = require('../middleware/authMiddleware'); // Import the middleware


router.get('/volunteers', async (req, res) => {
  try {
    // Fetch all volunteers from the database
    const volunteers = await Volunteer.find();
    res.status(200).json(volunteers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch volunteers' });
  }
});

// Route for registering a new volunteer
router.post('/register-volunteer', async (req, res) => {
  try {
    const { name, email, password, bloodGroup, contactNumber, address } = req.body;

    // Check if volunteer with the same email already exists
    const existingVolunteer = await Volunteer.findOne({ email });
    if (existingVolunteer) {
      return res.status(409).json({ error: 'Volunteer with the same email already exists' });
    }

    // Create a new volunteer
    const volunteer = new Volunteer({
      name,
      email,
      password,
      bloodGroup,
      contactNumber,
      address,
    });
    // Save the volunteer to the database
    await volunteer.save();

    res.status(201).json({ message: 'Volunteer registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register volunteer' });
  }
});

// Route for login


router.post('/login-volunteer', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if volunteer with the given email exists
    const volunteer = await Volunteer.findOne({ email });

    if (!volunteer) {
      return res.status(404).json({ error: 'Volunteer not found' });
    }

    // Check if the volunteer is approved
    if (!volunteer.approved) {
      return res.status(401).json({ error: 'Volunteer is not approved' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, volunteer.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // If email and password match, generate JWT token
    const payload = {
      volunteerId: volunteer._id,
      email: volunteer.email
    };
    const token = jwt.sign(payload, secretKey, { expiresIn: '365d' });

    // Create the user object to send back
    const user = {
      email: volunteer.email,
      name:volunteer.name,
      address: volunteer.address,
      bloodGroup:volunteer.bloodGroup,
      phoneNumber: volunteer.phoneNumber,
      contactNumber: volunteer.contactNumber,
       address:volunteer.address
      // add any other properties you want to include here
    };

    // Send success response with JWT token and user object
    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});


router.delete('/delete-volunteer/:email', async (req, res) => {
  try {
    const email = req.params.email;

    // Find the volunteer by email
    const volunteer = await Volunteer.findOne({ email });

    // If volunteer not found, return error
    if (!volunteer) {
      return res.status(404).json({ error: 'Volunteer not found' });
    }

    // Delete the volunteer from the database
    await Volunteer.deleteOne({ email });

    res.status(200).json({ message: 'Volunteer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete volunteer' });
  }
});

router.put('/update-approval-status/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const approved = req.body.approved;

    // Find the volunteer by email
    const volunteer = await Volunteer.findOne({ email });

    // If volunteer not found, return error
    if (!volunteer) {
      return res.status(404).json({ error: 'Volunteer not found' });
    }

    // Update the approval status
    volunteer.approved = approved;
    await volunteer.save();

    res.status(200).json({ message: 'Approval status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update approval status' });
  }
});

router.get('/protected', authenticateJWT, (req, res) => {
  
  // Access granted only if JWT is valid
  res.json({ message: 'Protected route accessed successfully', user: req.user });
});

module.exports = router;
