// Import required modules
const mongoose = require("mongoose");

// Define a Mongoose schema for blood donor information
const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  lastDonationDate: { type: Date, required: true },
  totalDonation: { type: Number, default: 0 },
  daysAfterDonation: { type: Number, default: 0 },
  addedBy: { type: String } // addedBy field to track who added the donor
});

// Create a Mongoose model for blood donors
const Donor = mongoose.model("Donor", donorSchema);

// Export the Donor model
module.exports = Donor;

// Create a Mongoose model for blood donors

