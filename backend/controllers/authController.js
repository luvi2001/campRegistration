const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'luviiissss'; // Use environment variable for production

// Signup handler
exports.signup = async (req, res) => {
  const { email, name, phone, countryName, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      name,
      phone,
      countryName,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Signup error', error: err.message });
  }
};

// Login handler
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    // Create token with user ID and name
    const token = jwt.sign({ userId: user._id,name: user.name,email:user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
        token,
        user: {
            name: user.name,
            email: user.email,
            // Add other user details if needed
        }
    });
} catch (error) {
    res.status(500).json({ message: 'Server error' });
}

};
