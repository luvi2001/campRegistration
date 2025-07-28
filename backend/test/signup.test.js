const request = require('supertest');
const app = require('../server'); // Import your app (Express instance)
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

beforeAll(async () => {
  // Connect to the test database before running the tests
  await mongoose.connect('mongodb://localhost:27017/yourTestDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Close the database connection after all tests have run
  await mongoose.connection.close();
});

beforeEach(async () => {
  // Clear the users collection before each test
  await User.deleteMany({});
});

describe('POST /signup', () => {
  it('should register a new user successfully', async () => {
    const newUser = {
      email: 'testuser@example.com',
      name: 'Test User',
      phone: '1234567890',
      countryName: 'Test Country',
      password: 'password123',
    };

    const response = await request(app).post('/signup').send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');

    const userInDb = await User.findOne({ email: newUser.email });
    expect(userInDb).not.toBeNull();
    expect(await bcrypt.compare(newUser.password, userInDb.password)).toBe(true);
  });

  it('should return an error if the user already exists', async () => {
    const existingUser = {
      email: 'testuser@example.com',
      name: 'Test User',
      phone: '1234567890',
      countryName: 'Test Country',
      password: 'password123',
    };

    // Create the user first
    const user = new User(existingUser);
    await user.save();

    const response = await request(app)
      .post('/signup')
      .send(existingUser); // Attempt to register again

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User already exists');
  });

  it('should return an error if required fields are missing', async () => {
    const incompleteUser = {
      email: 'testuser@example.com',
      name: 'Test User',
      phone: '1234567890',
    };

    const response = await request(app)
      .post('/signup')
      .send(incompleteUser); // Missing 'countryName' and 'password'

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Missing required fields');
  });

  it('should return an error if password is too weak', async () => {
    const weakPasswordUser = {
      email: 'testuser@example.com',
      name: 'Test User',
      phone: '1234567890',
      countryName: 'Test Country',
      password: '123', // Weak password
    };

    const response = await request(app)
      .post('/signup')
      .send(weakPasswordUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Password is too weak');
  });
});
