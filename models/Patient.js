const mongoose = require('mongoose');
const { Schema } = mongoose;

const BloodDonationSchema = new Schema({
  patientName: {
    type: String,
    required: true
  },
  bloodGroup: {
    type: String,
    required: true
  },
  bloodAmount: {
    type: String,
    required: true
  },
  donationDate: {
    type: Date,
    required: true
  },
  donationTime: {
    type: String,
    required: true
  },
  donationLocation: {
    type: String,
    required: true
  },
  contactInfo: {
    type: String,
    required: true
  },
  managed:{
    type:Boolean,
    default :false,
    required :false
  },
  addedBy: {
    type: String,
  },
  note: {
    type: String // add a new field called 'note' of type String
  }
});

const BloodDonation = mongoose.model('BloodDonation', BloodDonationSchema);

module.exports = BloodDonation;
