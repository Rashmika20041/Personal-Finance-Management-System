// Test script to verify savings goals API endpoints
const testSavingsGoalsAPI = async () => {
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

  // Test 1: Get savings goals (should be empty initially)
  console.log('📊 Testing GET /api/savings-goals...');
  const getResponse = await fetch(`${API_URL}/savings-goals`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (getResponse.ok) {
    const goals = await getResponse.json();
    console.log(`✅ GET successful: Found ${goals.length} savings goal records`);
  } else {
    console.error('❌ GET failed:', await getResponse.text());
  }

  // Test 2: Add new savings goal
  console.log('➕ Testing POST /api/savings-goals...');
  const newGoal = {
    name: 'New Laptop',
    targetAmount: 1500,
    currentContribution: 750,
    deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
    priority: 'High'
  };

  const postResponse = await fetch(`${API_URL}/savings-goals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(newGoal)
  });

  if (postResponse.ok) {
    const createdGoal = await postResponse.json();
    console.log('✅ POST successful: Savings goal created with ID:', createdGoal._id);

    // Test 3: Update the savings goal
    console.log('✏️ Testing PUT /api/savings-goals/:id...');
    const updateResponse = await fetch(`${API_URL}/savings-goals/${createdGoal._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...newGoal,
        currentContribution: 850,
        name: 'Updated Laptop Goal'
      })
    });

    if (updateResponse.ok) {
      console.log('✅ PUT successful: Savings goal updated');
    } else {
      console.error('❌ PUT failed:', await updateResponse.text());
    }

    // Test 4: Delete the savings goal
    console.log('🗑️ Testing DELETE /api/savings-goals/:id...');
    const deleteResponse = await fetch(`${API_URL}/savings-goals/${createdGoal._id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (deleteResponse.ok) {
      console.log('✅ DELETE successful: Savings goal deleted');
    } else {
      console.error('❌ DELETE failed:', await deleteResponse.text());
    }

  } else {
    console.error('❌ POST failed:', await postResponse.text());
  }

  console.log('🎉 Savings Goals API tests completed!');
};

// Run the tests
testSavingsGoalsAPI().catch(console.error);