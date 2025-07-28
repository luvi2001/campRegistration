require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const authRoutes = require('./routes/authRoutes');
const campRoutes = require('./routes/campRoutes');

// Enable CORS for all origins
app.use(cors()); // Allow requests from any origin

// Middleware
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/uploads', express.static('uploads')); // serve uploaded images


// Route handlers
app.use('/api/auth', authRoutes);
app.use('/api/users', campRoutes);


// Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connected'))
  .catch((err) => console.error('Error connecting to database:', err));



// Server listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
