const axios = require('axios');

// Test script for Budget API endpoints
const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

// Test user credentials
const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'budgettest@example.com',
  password: 'password123'
};

async function register() {
  try {
    console.log('📝 Registering test user...');
    const response = await axios.post(`${BASE_URL}/auth/register`, testUser);
    console.log('✅ Registration successful');
    return true;
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
      console.log('ℹ️ Test user already exists');
      return true;
    }
    console.log('❌ Registration failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function login() {
  try {
    console.log('🔐 Logging in...');
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    authToken = response.data.token;
    console.log('✅ Login successful');
    return true;
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testGetBudgets() {
  try {
    console.log('📋 Getting all budgets...');
    const response = await axios.get(`${BASE_URL}/budgets`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get budgets successful:', response.data.length, 'budgets found');
    return response.data;
  } catch (error) {
    console.log('❌ Get budgets failed:', error.response?.data?.message || error.message);
    return [];
  }
}

async function testAddBudget() {
  try {
    console.log('➕ Adding new budget...');
    const newBudget = {
      name: 'Monthly Food Budget',
      category: 'Groceries',
      amount: 500,
      spent: 0,
      duration: 'Monthly',
      threshold: 80
    };
    const response = await axios.post(`${BASE_URL}/budgets`, newBudget, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Add budget successful:', response.data);
    return response.data;
  } catch (error) {
    console.log('❌ Add budget failed:', error.response?.data?.message || error.message);
    return null;
  }
}

async function testUpdateBudget(budgetId) {
  try {
    console.log('✏️ Updating budget...');
    const updateData = {
      name: 'Updated Monthly Food Budget',
      category: 'Groceries',
      amount: 600,
      duration: 'Monthly',
      threshold: 85
    };
    const response = await axios.put(`${BASE_URL}/budgets/${budgetId}`, updateData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Update budget successful:', response.data);
    return response.data;
  } catch (error) {
    console.log('❌ Update budget failed:', error.response?.data?.message || error.message);
    return null;
  }
}

async function testDeleteBudget(budgetId) {
  try {
    console.log('🗑️ Deleting budget...');
    const response = await axios.delete(`${BASE_URL}/budgets/${budgetId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Delete budget successful');
    return true;
  } catch (error) {
    console.log('❌ Delete budget failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testSyncStatus() {
  try {
    console.log('🔄 Getting sync status...');
    const response = await axios.get(`${BASE_URL}/sync/status`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Sync status:', response.data);
    return response.data;
  } catch (error) {
    console.log('❌ Get sync status failed:', error.response?.data?.message || error.message);
    return null;
  }
}

async function testSyncBudgets() {
  try {
    console.log('🔄 Syncing budgets...');
    const response = await axios.post(`${BASE_URL}/sync/budgets`, {}, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Sync budgets successful:', response.data);
    return response.data;
  } catch (error) {
    console.log('❌ Sync budgets failed:', error.response?.data?.message || error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting Budget API Tests...\n');

  // Register test user first
  if (!(await register())) {
    console.log('❌ Cannot proceed without user registration');
    return;
  }

  // Login
  if (!(await login())) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }

  // Test getting budgets
  const budgets = await testGetBudgets();

  // Test adding a budget
  const newBudget = await testAddBudget();
  let budgetId = newBudget?._id;

  // If no new budget was created, use existing one
  if (!budgetId && budgets.length > 0) {
    budgetId = budgets[0]._id;
    console.log('📝 Using existing budget for update/delete tests');
  }

  // Test updating budget if we have an ID
  if (budgetId) {
    await testUpdateBudget(budgetId);
  }

  // Test sync status
  await testSyncStatus();

  // Test syncing budgets
  await testSyncBudgets();

  // Test deleting budget if we created one
  if (newBudget && budgetId) {
    await testDeleteBudget(budgetId);
  }

  console.log('\n✅ Budget API Tests completed!');
}

// Run the tests
runTests().catch(console.error);