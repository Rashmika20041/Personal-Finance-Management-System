const mongoose = require('mongoose');
const User = require('./models/User');

async function testRegistration() {
  try {
    // Connect to MongoDB first
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Test user creation directly
    const testUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    console.log('Testing user creation...');
    const user = new User(testUser);
    await user.save();
    console.log('User created successfully:', user);

    // Clean up
    await User.findByIdAndDelete(user._id);
    console.log('Test user cleaned up');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

testRegistration();