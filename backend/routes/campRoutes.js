const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { addUser } = require('../controllers/campController');
const User = require('../models/camper');

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // folder must exist
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// POST /api/users/add
router.post('/add', upload.single('image'), addUser);

router.get('/all', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// DELETE /api/users/delete/:id
router.delete('/delete/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});


// PATCH /api/users/update/:id
router.patch('/update/:id', async (req, res) => {
  try {
    const updatedCamper = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedCamper);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update camper' });
  }
});

// PUT /api/users/:id
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updates = {
      ...req.body,
      image: req.file ? req.file.filename : undefined,
    };
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





module.exports = router;
