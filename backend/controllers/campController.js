const User = require('../models/camper');

// Add a new user
const addUser = async (req, res) => {
  try {
    const { name, age, phoneNumber, area, team,school,remarks } = req.body;
    const image = req.file ? req.file.filename : null;

    const newUser = new User({
      name,
      age,
      phoneNumber,
      gender,
      area,
      team,
      school,
      image,
      remarks,
      payment,
    });

    await newUser.save();
    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Failed to add user' });
  }
};

module.exports = {
  addUser,
};
