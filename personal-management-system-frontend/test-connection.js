// Simple test to verify frontend-backend connection
const testConnection = async () => {
  try {
    console.log('Testing backend connection...');

    // Test login
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'budgettest@example.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error('Login failed');
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful');

    // Test budgets endpoint
    const budgetsResponse = await fetch('http://localhost:5000/api/budgets', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!budgetsResponse.ok) {
      throw new Error('Budgets fetch failed');
    }

    const budgets = await budgetsResponse.json();
    console.log('✅ Budgets fetch successful:', budgets.length, 'budgets');

    console.log('🎉 Frontend-backend connection test passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testConnection();