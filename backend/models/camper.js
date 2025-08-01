const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  phoneNumber: String,
  area: String,
  team: String,
  school: String,
  image: String, // file path
  remarks: String,
  payment:Number,
  arrivedForBus: {
    type: Boolean,
    default: false
  },
  arrivedCampSite: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Camper', userSchema);
