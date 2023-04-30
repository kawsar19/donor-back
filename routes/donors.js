const express = require('express');
const router = express.Router();
const Donors = require('../models/Donors');

require('dotenv').config(); 
const secretKey = process.env.SECRET_KEY;

const authenticateJWT = require('../middleware/authMiddleware'); // Import the middleware

router.get("/all-donors", authenticateJWT, (req, res) => {
  // Retrieve all donors from the database added by the authenticated user
  const userEmail = req.user.email; // Get the email of the authenticated user from req.user
  Donors.find({ addedBy: userEmail }) // Only retrieve donors added by the authenticated user
    .then(donors => {
      res.json(donors);
    })
    .catch(error => {
      res.status(500).json({ error: "Failed to fetch donors" });
    });
});
router.get('/donors/:id', authenticateJWT, async (req, res) => {
  try {
    const donorId = req.params.id; // Get the donor ID from the URL parameters
    const userEmail = req.user.email; // Get the email of the authenticated user from req.user

    // Find the donor by ID and check if the addedBy field matches the authenticated user
    const donor = await Donors.findOne({ _id: donorId, addedBy: userEmail });

    if (!donor) {
      // Donor not found or user is not the one who added the donor
      return res.status(404).json({ error: "Donor not found or you are not authorized to access this donor" });
    }
    
    // Remove the time portion from the lastDonationDate property
    const lastDonationDate = donor.lastDonationDate.toISOString().slice(0, 10);

    // Create a new object for the response
    const response = {
      id: donor._id,
      name: donor.name,
      phone: donor.phone,
      address: donor.address,
      bloodGroup: donor.bloodGroup,
      lastDonationDate,
      totalDonation: donor.totalDonation,
      daysAfterDonation: donor.daysAfterDonation,
      addedBy: donor.addedBy
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get donor" });
  }
});




//add a new donor

router.post('/add-donor', authenticateJWT, async (req, res) => {
  try {
    // Extract data from request body
    const { name, phone, address, bloodGroup, lastDonationDate, totalDonation } = req.body;
    const userEmail = req.user.email; // Get the email of the authenticated user from req.user

    // Convert lastDonationDate to a year-month-day string
    const lastDonation = new Date(lastDonationDate);
    const lastDonationYMD = lastDonation.toISOString().substring(0, 10);

    // Calculate the "daysAfterDonation" field based on the "lastDonationDate"
    const today = new Date();
    const timeDifference = Math.abs(today.getTime() - lastDonation.getTime());
    const daysAfterDonation = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Calculate days difference

    // Create a new donor object with addedBy field set to the email of the authenticated user
    const newDonor = new Donors({
      name,
      phone,
      address,
      bloodGroup,
      lastDonationDate: lastDonationYMD,
      totalDonation,
      daysAfterDonation,
      addedBy: userEmail // Set the addedBy field to the email of the authenticated user
    });

    // Save the new donor to the database
    await newDonor.save();

    res.json({ message: "New donor added successfully", donor: newDonor });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding donor", error });
}

});


router.put('/update-donor/:id', authenticateJWT, async (req, res) => {
  try {
    const donorId = req.params.id; // Get the donor ID from the URL parameters
    const userEmail = req.user.email; // Get the email of the authenticated user from req.user

    // Extract data from request body
    const { name, phone, address, bloodGroup, lastDonationDate, totalDonation } = req.body;

    // Calculate the "daysAfterDonation" field based on the "lastDonationDate"
    const today = new Date();
    const lastDonation = new Date(lastDonationDate);
    const timeDifference = Math.abs(today.getTime() - lastDonation.getTime());
    const daysAfterDonation = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Calculate days difference

    // Find the donor by ID and check if the addedBy field matches the authenticated user
    const donor = await Donors.findOne({ _id: donorId, addedBy: userEmail });

    if (!donor) {
      // Donor not found or user is not the one who added the donor
      return res.status(404).json({ error: "Donor not found or you are not authorized to update this donor" });
    }

    // Construct the update object
    const update = {
      name,
      phone,
      address,
      bloodGroup,
      lastDonationDate,
      totalDonation,
      daysAfterDonation,
      addedBy: userEmail // Set the addedBy field to the email of the authenticated user
    };

    // Update the donor in the database and return the updated donor object
    const updatedDonor = await Donors.findOneAndUpdate(
      { _id: donorId }, // Find donor by ID
      update, // Update object
      { new: true } // Return the updated donor object
    );

    res.json({ message: "Donor updated successfully", donor: updatedDonor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update donor" });
  }
});

router.delete('/delete-donor/:id', authenticateJWT, async (req, res) => {
  try {
    const donorId = req.params.id; // Get the donor ID from the URL parameters
    const userEmail = req.user.email; // Get the email of the authenticated user from req.user

    // Find the donor by ID and check if the addedBy field matches the authenticated user
    const donor = await Donors.findOne({ _id: donorId, addedBy: userEmail });

    if (!donor) {
      // Donor not found or user is not the one who added the donor
      return res.status(404).json({ error: "Donor not found or you are not authorized to delete this donor" });
    }

    // Delete the donor from the database
    await Donors.findOneAndDelete({ _id: donorId });

    res.json({ message: "Donor deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete donor" });
  }
});




module.exports = router;