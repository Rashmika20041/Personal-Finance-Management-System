// Test script to verify income API endpoints
const testIncomeAPI = async () => {
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

  // Test 1: Get incomes (should be empty initially)
  console.log('📊 Testing GET /api/income...');
  const getResponse = await fetch(`${API_URL}/income`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (getResponse.ok) {
    const incomes = await getResponse.json();
    console.log(`✅ GET successful: Found ${incomes.length} income records`);
  } else {
    console.error('❌ GET failed:', await getResponse.text());
  }

  // Test 2: Add new income
  console.log('➕ Testing POST /api/income...');
  const newIncome = {
    amount: 5000,
    source: 'Software Development',
    date: new Date().toISOString().split('T')[0],
    description: 'Monthly salary'
  };

  const postResponse = await fetch(`${API_URL}/income`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(newIncome)
  });

  if (postResponse.ok) {
    const createdIncome = await postResponse.json();
    console.log('✅ POST successful: Income created with ID:', createdIncome._id);

    // Test 3: Update the income
    console.log('✏️ Testing PUT /api/income/:id...');
    const updateResponse = await fetch(`${API_URL}/income/${createdIncome._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...newIncome,
        amount: 5500,
        description: 'Updated monthly salary'
      })
    });

    if (updateResponse.ok) {
      console.log('✅ PUT successful: Income updated');
    } else {
      console.error('❌ PUT failed:', await updateResponse.text());
    }

    // Test 4: Delete the income
    console.log('🗑️ Testing DELETE /api/income/:id...');
    const deleteResponse = await fetch(`${API_URL}/income/${createdIncome._id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (deleteResponse.ok) {
      console.log('✅ DELETE successful: Income deleted');
    } else {
      console.error('❌ DELETE failed:', await deleteResponse.text());
    }

  } else {
    console.error('❌ POST failed:', await postResponse.text());
  }

  console.log('🎉 Income API tests completed!');
};

// Run the tests
testIncomeAPI().catch(console.error);