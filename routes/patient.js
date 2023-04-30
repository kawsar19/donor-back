const express = require('express');
const router = express.Router();
const BloodDonation = require('../models/Patient');

const authenticateJWT = require('../middleware/authMiddleware'); 
router.get('/all-requests', async (req, res) => {
  try {
    const donations = await BloodDonation.find();
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Create a new blood donation record
router.post('/blood-request',authenticateJWT , async (req, res) => {
  
  console.log(req.user)
  const { patientName, bloodGroup, bloodAmount, donationDate, donationTime, donationLocation, contactInfo ,managed , note} = req.body;
  try {
    const newDonation = new BloodDonation({
      patientName,
      bloodGroup,
      bloodAmount,
      donationDate,
      donationTime,
      donationLocation,
      contactInfo,
      managed,
      addedBy: req.user.email,
      note 
      
    });
    const savedDonation = await newDonation.save();
    res.json(savedDonation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
