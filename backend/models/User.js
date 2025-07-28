const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  phone: String,
  countryName: String,
  password: {
    type: String,
    required: true,
  },
  favoriteCountries: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model('UserRestCountriesAPI', userSchema);
