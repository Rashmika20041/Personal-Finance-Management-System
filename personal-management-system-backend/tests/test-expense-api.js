// Test script to verify expense API endpoints
const testExpenseAPI = async () => {
  const API_URL = 'http://localhost:5000/api';

  // First, register a test user
  console.log('🔐 Registering test user...');
  const registerResponse = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'TestPass123!'
    })
  });

  if (!registerResponse.ok) {
    console.log('User already exists, proceeding with login...');
  }

  // Login to get token
  console.log('🔑 Logging in...');
  const loginResponse = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'TestPass123!'
    })
  });

  const loginData = await loginResponse.json();
  if (!loginResponse.ok) {
    console.error('❌ Login failed:', loginData);
    return;
  }

  const token = loginData.token;
  console.log('✅ Login successful, token received');

  // Test 1: Get expenses (should be empty initially)
  console.log('📊 Testing GET /api/expense...');
  const getResponse = await fetch(`${API_URL}/expense`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (getResponse.ok) {
    const expenses = await getResponse.json();
    console.log(`✅ GET successful: Found ${expenses.length} expense records`);
  } else {
    console.error('❌ GET failed:', await getResponse.text());
  }

  // Test 2: Add new expense
  console.log('➕ Testing POST /api/expense...');
  const newExpense = {
    amount: 75.50,
    category: 'Groceries',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Credit Card',
    notes: 'Weekly shopping'
  };

  const postResponse = await fetch(`${API_URL}/expense`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(newExpense)
  });

  if (postResponse.ok) {
    const createdExpense = await postResponse.json();
    console.log('✅ POST successful: Expense created with ID:', createdExpense._id);

    // Test 3: Update the expense
    console.log('✏️ Testing PUT /api/expense/:id...');
    const updateResponse = await fetch(`${API_URL}/expense/${createdExpense._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...newExpense,
        amount: 85.50,
        notes: 'Updated weekly shopping'
      })
    });

    if (updateResponse.ok) {
      console.log('✅ PUT successful: Expense updated');
    } else {
      console.error('❌ PUT failed:', await updateResponse.text());
    }

    // Test 4: Delete the expense
    console.log('🗑️ Testing DELETE /api/expense/:id...');
    const deleteResponse = await fetch(`${API_URL}/expense/${createdExpense._id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (deleteResponse.ok) {
      console.log('✅ DELETE successful: Expense deleted');
    } else {
      console.error('❌ DELETE failed:', await deleteResponse.text());
    }

  } else {
    console.error('❌ POST failed:', await postResponse.text());
  }

  console.log('🎉 Expense API tests completed!');
};

// Run the tests
testExpenseAPI().catch(console.error);